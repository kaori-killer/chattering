const Message = ({ user, text }) => (
    <div className="message">
      <strong>{user} :</strong>
      <span>{text}</span>
    </div>
  );

export default Message;