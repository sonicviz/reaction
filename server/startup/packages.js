import { Packages, Products } from "/lib/collections";
import { Reaction } from "/server/api";

export default function () {
  /**
   * ReactionCore Collection Hooks
   * transform collections based on events
   *
   * See: https://github.com/matb33/meteor-collection-hooks
   */

  /*
   * refresh mail configuration on package change
   */
  Packages.after.update((userId, doc, fieldNames, modifier) => {
    if (modifier.$set) {
      if (modifier.$set.settings) {
        if (modifier.$set.settings.mail || modifier.$set["settings.mail.user"]) {
          return Reaction.configureMailUrl();
        }
      }
    }
  });


  /**
   * before product update
   */
  Products.before.update((userId, product, fieldNames, modifier) => {
    // handling product positions updates
    if (_.indexOf(fieldNames, "positions") !== -1) {
      if (modifier.$addToSet) {
        if (modifier.$addToSet.positions) {
          createdAt = new Date();
          updatedAt = new Date();
          if (modifier.$addToSet.positions.$each) {
            for (position in modifier.$addToSet.positions.$each) {
              if ({}.hasOwnProperty.call(modifier.$addToSet.positions.$each,
                  position)) {
                createdAt = new Date();
                updatedAt = new Date();
              }
            }
          } else {
            modifier.$addToSet.positions.updatedAt = updatedAt;
          }
        }
      }
    }
  });
}
