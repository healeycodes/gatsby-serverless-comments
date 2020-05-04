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
  const existingFile = JSON.parse(
    await fetch(api, {
      headers: {
        Authorization:
          "Basic " + Buffer.from(user + ":" + auth).toString("base64"),
      },
    }).then(res => res.text())
  )

  let comments = JSON.parse(Buffer.from(existingFile.content, "base64").toString("utf-8"))

  const newComment = JSON.parse(event.body)
  comments.push({
    author: newComment.author,
    email: newComment.email,
    message: newComment.message,
    date: Date.now(),
  })

  const res = await fetch(api, {
    method: "PUT",
    headers: {
      Authorization:
        "Basic " + Buffer.from(user + ":" + auth).toString("base64"),
    },
    body: JSON.stringify({
      message: "New comment on " + new Date().toDateString(),
      content: Buffer(comments).toString("base64"),
      sha: existingFile.sha,
    }),
  }).then(res => res.text())

  callback(null, {
    statusCode: 200,
    body: res,
  })
}
