const Notification = ({ message }) => {
  if (!message) return null

  return (
    <div className={message.error ? "error" : "notification"}>
      {message.message}
    </div>
  )
}

export default Notification