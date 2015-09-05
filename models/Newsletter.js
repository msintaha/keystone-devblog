var keystone = require('keystone'),
Types = keystone.Field.Types;

var Newsletter = new keystone.List('Newsletter', {
  map: { name: 'title' },
  autokey: {path: 'key', from: 'title' },
  defaultSort: '-sendAt'
});

Newsletter.add({
  title: { type: String, required: true },
  image: { type: Types.CloudinaryImage },
  state: { type: Types.Select, options: 'draft, active', default: 'draft', index: true },
  message: { type: Types.Html, wysiwyg: true, height: 200 },
  link: {type: Types.Url},
  template: { type: Types.Select, options: 'email-default', default: 'email-default'},
  fromName: { type: String, default: 'FamilyCap'},
  fromEmail: { type: Types.Email, default: 'contact@familycap.com'},
  sendAt: { type: Types.Datetime, default: Date.now},
  complete: {type: Boolean, noedit: true},
  sendCounter: {type: Number, noedit: true},
  openCounter: {type: Number, noedit: true}
});

Newsletter.schema.pre('save', function(next) {
  //this.wasNew = this.isNew;
  if (this.complete && this.state == 'active' && this.sendAt > new Date()) {
    this.complete = false;
  }
  next();
})

Newsletter.schema.methods.sendNewsletter = function(callback) {

  var newsletter = this;

  keystone.list('Newsletter').model.find()
    .exec(function(err, users) {

      if (err) return callback(err);

      Newsletter.model.update({_id: email.id}, {$set: {complete: true}, $inc: {sendCounter: users.length}}, function(err) {
        if(err) console.log(err);
      });

      new keystone.Newsletter(newsletter.template).send({
  to: users,
  from: {
    name: newsletter.fromName,
    email: newsletter.fromEmail
  },
  subject: newsletter.title,
  mail: newsletter,
        web_view_url: 'http://mobilap.biz/email/'+newsletter.id,
        unsubscribe_url: 'http://mobilap.biz/unsubscribe'
      }, callback);
    });
}

Newsletter.defaultColumns = 'title, state, groups, sendAt, complete|10%, sendCounter|10%, openCounter|10%';
Newsletter.register();