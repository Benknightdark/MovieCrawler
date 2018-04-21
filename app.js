const BUILDER = require("botbuilder");
const RESTIFY = require("restify");

/* Setup Server */
const SERVER = RESTIFY.createServer();
SERVER.listen(process.env.PORT || 3978, () => {
  console.log(`Bot Server is running on port 3978. ${SERVER.url}`);
});

/* Initial Bot */
// const connector = new BUILDER.ConsoleConnector().listen();
const connector = new BUILDER.ChatConnector();

SERVER.post("/api/messages", connector.listen());

const bot = new BUILDER.UniversalBot(connector, session => {
  session.beginDialog("setAppointment");
  session.beginDialog("returnMovieListData");
});
bot.on("conversationUpdate", function(message) {
  if (message.membersAdded && message.membersAdded.length > 0) {
    var txt = `輸入【最新電影】會回傳當月份上映的電影名單`;
    var reply = new BUILDER.Message().address(message.address).text(txt);
    bot.send(reply);
  } else if (message.membersRemoved) {
    // See if bot was removed
    var botId = message.address.bot.id;
    for (var i = 0; i < message.membersRemoved.length; i++) {
      if (message.membersRemoved[i].id === botId) {
        // Say goodbye
        var reply = new BUILDER.Message()
          .address(message.address)
          .text("Goodbye");
        bot.send(reply);
        break;
      }
    }
  }
});

// Add first run dialog
bot.dialog("setAppointment", session => {
  if (session.message.text !== "最新電影") {
    session.send("請輸入【最新電影】").endDialog();
  } else {
    ReturnMovieData(session.message.text);
  }
});

const ReturnMovieData = thisMonth => {
  bot.dialog("returnMovieListData", session => {
    session.send("from aoth ," + thisMonth).endDialog();
  });
};
