import React from "react"
import comments from "../comments.json"

export default function () {
  const formatted = comments.map((comment, i) => (
    <li key={i}>
      author: {comment.author}
      <br />
      email: {comment.email}
      <br />
      message: {comment.message}
    </li>
  ))
  return <ul>{formatted}</ul>
}
