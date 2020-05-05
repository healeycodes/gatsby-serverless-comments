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
        Authorization:
          "Basic " + Buffer.from(user + ":" + auth).toString("base64"),
      },
    }).then(res => res.text())
  )

  // File content is stored in base64 encoding, let's parse that into utf-8 and then into an object
  let comments = JSON.parse(Buffer.from(existingFile.content, "base64").toString("utf-8"))

  // Here is the user submitted comment
  // Perhaps here we would do some validation e.g. for security
  const newComment = JSON.parse(event.body)

  // Add the new comment to the existing comments
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
        "Basic " + Buffer.from(user + ":" + auth).toString("base64"),
    },
    body: JSON.stringify({
      message: "New comment on " + new Date().toDateString(),

      // Let's turn that object back into a string and encoded it
      content: Buffer(JSON.stringify(comments)).toString("base64"),

      // The blob SHA of the file being changed is required
      sha: existingFile.sha,
    }),
  }).then(res => res.text())

  callback(null, {
    statusCode: 204,
  })
}
