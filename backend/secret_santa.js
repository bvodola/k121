const mailgun = require('./mailgun');

// draw()
// Faz o sorteio de amigo secreto entre os usuários
var draw = (users) => {

  try {
    // Array of User that can still be drawed
    var drawableUsers = users.map(function(user) {
     return { _id: user._id, name: user.name };
    });

    // Single Draw Function
    var singleDraw = function(user) {

      var selectedUser = drawableUsers[Math.floor(Math.random()*drawableUsers.length)];

      if(user._id == selectedUser._id) {
        if(drawableUsers.length > 1) {
          return singleDraw(user);
        }
        else
          return false
      } else {

        drawableUsers = drawableUsers.filter(function(u) {
          if(u._id === selectedUser._id)
            return false;
          else
            return true
        });
        return selectedUser;
      }
    }

    // Drawing
    var modifiedUsers = users.map(function(user,i) {
      var secret_santa = singleDraw(user);
      user.secret_santa = secret_santa;
      return user;
    });

    // Checking the Drawed Secret Santas
    modifiedUsers.forEach(function(user){
      if(!user.secret_santa || typeof user.secret_santa == 'undefined')
        draw();
    });

    // Returning the users array
    sendEmails(modifiedUsers);
    return modifiedUsers;

  } catch(err) {
    console.log(err);
  }

}

// sendEmails()
// Envia email a todos usuários contendo o nome do amigo secreto de cada um
var sendEmails = (users) => {
  users.forEach((user) => {
    mailgun.send({
      from: 'amigosecreto@k121.com.br',
      to: user.email,
      subject: 'Amigo secreto',
      text: `Olá, ${user.name}! \nVocê tirou: ${user.secret_santa.name}`
    }, (err, body) => {
      if(err) {
        console.log(err);
      }
      else {
        console.log(body);
      }
    });
  });
}

module.exports = { draw, sendEmails };
