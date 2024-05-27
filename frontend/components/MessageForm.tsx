const MessageForm = ({ onMessageSubmit, user }) => {
    const [text, setText] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const message = { user, text };
      onMessageSubmit(message);
      setText('');
    };
  
    return (
      <div className='message_form'>
        <form onSubmit={handleSubmit}>
          <input
            placeholder='메시지 입력'
            className='textinput'
            onChange={(e) => setText(e.target.value)}
            value={text}
          />
          <h3></h3>
        </form>
      </div>
    );
  };

  export default MessageForm;