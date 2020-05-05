import React from "react"
import comments from "../comments.json"

class CommentForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      author: "",
      email: "",
      message: "",
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  async handleSubmit() {
    const status = await fetch("/.netlify/functions/comment", {
      method: "PUT",
      body: JSON.stringify({
        name: this.state.author,
        email: this.state.email,
        message: this.state.message,
      }),
    }).then(res => res.status)

    console.log(status)
  }

  render() {
    const formattedComments = comments.map((comment, i) => (
      <li key={i} style={{ listStyle: "none", paddingBottom: "25px" }}>
        <div>
          <b>Author:</b> {comment.author}
        </div>
        <div>
          <b>Message:</b> {comment.message}
        </div>
        <div>
          <b>Email:</b> {comment.email}
        </div>
      </li>
    ))

    return (
      <main>
        {formattedComments}
        <div style={{ paddingTop: "50px" }} />
        <form>
          <div>
            <label htmlFor="name" style={{ display: "block" }}>
              Name:
            </label>
            <input
              name="author"
              placeholder="Alice"
              value={this.state.name}
              onChange={this.handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="email" style={{ display: "block" }}>
              Email:
            </label>
            <input
              name="email"
              placeholder="alice@example.org"
              value={this.state.email}
              onChange={this.handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="message" style={{ display: "block" }}>
              Message:
            </label>
            <input
              name="message"
              placeholder="A nice message"
              value={this.state.message}
              onChange={this.handleInputChange}
            />
          </div>

          <button type="button" onClick={this.handleSubmit}>
            Submit
          </button>
        </form>
      </main>
    )
  }
}

export default CommentForm
