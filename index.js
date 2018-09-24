var secureScuttlebutt = require("secure-scuttlebutt")

var pull = require('pull-stream')

var pathToSecret = './ssb-identity'
var keys = require('ssb-keys').loadOrCreate(pathToSecret, function(err, keys) {
  if (err) return console.error(err)
  console.log("keys:", keys)

  var levelup = require('levelup')
  var memdown = require('memdown')
                                     //  V *** require legacy.js ***
  var sublevel = require('level-sublevel/legacy')
  var db = sublevel(levelup(memdown()))

  var ssb = require('secure-scuttlebutt')(db, { path: '/' })
  var feed = ssb.createFeed(keys)

  feed.add({ type: 'post', text: 'My First Post!' }, function (err, msg, hash) {
    // the message as it appears in the database:
    console.log("message:", msg)

    // and its hash:
    console.log("hash:", hash)
  })

  feed.add({ type: 'post', text: 'My Second Post!' }, function (err, msg, hash) {
    // the message as it appears in the database:
    console.log("message:", msg)

    // and its hash:
    console.log("hash:", hash)
  })

  // stream all messages for all keypairs.
  pull(
    ssb.createFeedStream(),
    pull.collect(function (err, ary) {
      console.log(ary)
    })
  )

  // stream all messages for a particular keypair.
  pull(
    ssb.createHistoryStream({id: feed.id}),
    pull.collect(function (err, ary) {
      console.log(ary)
    })
  )
})