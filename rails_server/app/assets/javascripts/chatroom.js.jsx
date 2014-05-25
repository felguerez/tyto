/** @jsx React.DOM */
$(document).ready(function() {
  $('.chatFixed').click(function() {
    $('.chatBox').slideToggle("fast");
    messaging = $('.chatMessages');
    messaging.scrollTop(messaging.prop("scrollHeight"));
  });
});

var ws = new WebSocket("ws://fierce-tundra-6534.herokuapp.com/");

ws.onmessage = function(message) {
  var data = JSON.parse(message.data);
  classrooms = [];
  ChattingBox.state.classrooms.forEach(function(classroom){
    if(classroom.id===data.classroom_id){
      classroom.chat.push(data);
    }
    classrooms.push(classroom);
  });
  ChattingBox.setState({classrooms: classrooms});
  messaging = $('.chatMessages');
  messaging.scrollTop(messaging.prop("scrollHeight"));
  $.ajax({
    url: '/messages/create',
    dataType: 'json',
    type: 'POST',
    data: data,
    success: function(data) {
    }.bind(this),
    error: function(xhr, status, err) {
      console.error(this.props.url, status, err.toString());
    }.bind(this)
  });
};

window.ChatBox = React.createClass({
  getInitialState: function() {
  return {classrooms: [], selectedIndex: 0, message: ''};
  },
  componentWillMount: function() {
    data = {classroom_ids: this.props.classroomIds};
    $.ajax({
      url: '/messages/index',
      dataType: 'json',
      type: 'POST',
      data: data,
      success: function(data) {
        this.setState({classrooms: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleChatChange: function(e){
    this.setState({selectedIndex: e.target.value}, function() {
    messaging = $('.chatMessages');
    messaging.scrollTop(messaging.prop("scrollHeight"));
    });
  },
  handleSubmit: function(e){
    e.preventDefault();
    var username = this.props.username;
    var message   = this.state.message;
    var classroom_id = this.state.classrooms[this.state.selectedIndex].id;
    var struggling = this.props.struggling;
    ws.send(JSON.stringify({username: username, message: message, classroom_id: classroom_id, struggling: struggling}));
    this.setState({message: ''});
  },
  handleMessageChange: function(e){
    this.setState({message: e.target.value })
  },
  render: function() {
    var counter = -1;
    var classrooms = this.state.classrooms.map(function(classroom) {
      counter = counter + 1;
      return (
        <option value={counter}>{classroom.name}</option>
      );
    });
    if(this.state.classrooms.length > 0){
      var messages = this.state.classrooms[this.state.selectedIndex].chat.map(function(message) {
        return (
          <p>{message.username}: {message.message}</p>
        );
      })};
    return (
      <div className="reactChatBox">
        <div className="topChatBar row">
          <select className="classroomList" onChange={this.handleChatChange}>
            {classrooms}
          </select>
        </div>
        <div className="chatMessages">
          {messages}
        </div>
        <div className="chatInput row">
          <form onSubmit={this.handleSubmit}>
            <input type="text" placeholder="start chatting" value={this.state.message} onChange={this.handleMessageChange} />
          </form>
        </div>
      </div>
    );
  }
});



