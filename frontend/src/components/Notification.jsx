const Notification = ({ message }) => {
  if (message === null) return null

  return (
    <div className={message.error ? "error" : "notification"}>
      {message.message}
    </div>
  )
}

export default Notification