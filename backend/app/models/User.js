const bookshelf = require('../config/bookshelf');
const BaseModel = require('bookshelf-modelbase')(bookshelf);
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const Redis = require("../../app").Redis;

class User extends BaseModel {
    get tableName() {
        return "users";
    }

    get hasTimestamps() {
        return true;
    }

    initialize() {
        this.on("creating", this.hashPassword, this);

        this.on("saving", this.hashPassword, this);
        this.on("saved", this.cache, this);
    }

    cache() {
        return Redis.hmsetAsync("user:" +  this.get("id") + ":details", {
            id: this.get("id"),
            email: this.get("email"),
            name: this.get("name"),
            avatar: this.getAvatar()
        });
    }

    hashPassword(model, attrs, options) {
      return new Promise((accept, reject) => {
        // If password isn't updated and method isn't insert, don't hash the password
        if (options.method !== "insert" && attrs.hasOwnProperty("password") === false) {
          accept();
        } else {
          // Otherwise, generate a hash and use it
          bcrypt.genSalt(10, (err, salt) => {
            if( err ) reject(err);
            bcrypt.hash(model.get("password"), salt, null, (err, hash) => {
              if (err) reject(err);
              model.set("password", hash);
              accept(hash);
            });
          });
        }
      });
    }

    comparePassword(password, cb) {
      bcrypt.compare(password, this.get("password"), (err, isMatch) => {
        cb(err, isMatch);
      });
    }

    getAvatar() {
      const md5 = crypto.createHash('md5').update(this.get("email")).digest('hex');
      return `https://gravatar.com/avatar/${md5}?s=200&d=retro`;
    }

    isAdmin() {
      return !! this.get("is_admin");
    }

    isBlocked() {
      return !! this.get("is_blocked");
    }
};

module.exports = User;
