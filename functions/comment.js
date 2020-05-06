const fetch = require("node-fetch")

const auth = process.env.GITHUB_PAT_TOKEN
const repo = process.env.GITHUB_REPO
const user = process.env.GITHUB_USER
const api =
  "https://api.github.com/repos/" +
  user +
  "/" +
  repo +
  "/contents/src/comments.json"

exports.handler = async function (event, context, callback) {
  // Use the Contents API from GitHub
  // https://developer.github.com/v3/repos/contents/#get-contents
  const existingFile = JSON.parse(
    await fetch(api, {
      headers: {
        // Pass some kind of authorization
        // I'm using a personal access token
        Authorization:
          "Basic " + Buffer.from(user + ":" + auth)
            .toString("base64"),
      },
    }).then(res => res.text())
  )

  // The file's content is stored in base64 encoding
  // Decode that into utf-8 and then parse into an object
  let comments = JSON.parse(
    Buffer.from(existingFile.content, "base64")
      .toString("utf-8")
  )

  // This is the user submitted comment
  // Perhaps we would do some validation here
  const newComment = JSON.parse(event.body)

  // Update the comments
  comments.push({
    author: newComment.author,
    email: newComment.email,
    message: newComment.message,
    date: Date.now(),
  })

  // Use the Contents API to save the changes
  const res = await fetch(api, {
    method: "PUT",
    headers: {
      Authorization:
        "Basic " + Buffer.from(user + ":" + auth)
          .toString("base64"),
    },
    body: JSON.stringify({
      message: "New comment on " + new Date()
        .toDateString(),

      // Turn that object back into a string and encoded it
      content: Buffer(JSON.stringify(comments))
        .toString("base64"),

      // Required: the blob SHA of the existing file
      sha: existingFile.sha,
    }),
  }).then(res => res.text())

  callback(null, {
    statusCode: 204,
  })
}
