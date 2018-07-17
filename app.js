

var restify = require('restify');
var builder = require('botbuilder');
var azure = require('botbuilder-azure');
var Simsimi = require('simsimi');

var simsimi = new Simsimi({
    key: '6aebc819-b0ba-4cf3-bcb6-12d847bbdabd'
});

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 8080, function () {
    console.log('%s listening to %s', server.name, server.url);
});

var documentDbOptions = {
    host: 'https://letedb.documents.azure.com:443/',
    masterKey: 't21FPEcKBrrgVefyzmEh0teuJ9zdce6NSspCPsDGa3ROOOxJmAp7DViV5NnjRtU13m79Kuqev5QXnrChv1Eo0g==',
    database: 'botdocs',
    collection: 'botdata'
};

// Skypebot credentials
var connector = new builder.ChatConnector({
    appId: 'ca632273-f04f-463d-b8ed-5c8509c1ca82',
    appPassword: 'epzfEOBLUA7357{hoqV5!;?'
});

var docDbClient = new azure.DocumentDbClient(documentDbOptions);

var cosmosStorage = new azure.AzureBotStorage({ gzipData: false }, docDbClient);

var bot = new builder.UniversalBot(connector).set('storage', cosmosStorage);
server.post('/api/messages', connector.listen());

bot.on('contactRelationUpdate', function (message) {
    if (message.action === 'add') {
        var name = message.user ? message.user.name : null;
        var reply = new builder.Message()
            .address(message.address)
            .text("Hello %s... Thanks for adding me. Say 'hello' to see some great demos.", name || 'there');
        bot.send(reply);
    } else {
        // delete their data
    }
});

bot.on('typing', function (message) {
    // User is typing
});
bot.on('deleteUserData', function (message) {
    // User asked to delete their data
});
//=========================================================
// Bots Dialogs
//=========================================================
String.prototype.contains = function (content) {
    return this.indexOf(content) !== -1;
};
bot.dialog('/', function (session) {
    if (session.message.text.toLowerCase().contains(('chào mn đi e').toLowerCase())) {
        session.send(' hello, em là letebot, đệ của a Vinh ạ');
    } else if (session.message.text.toLowerCase().contains('help')) {
        session.send('How can I help you?');
    } else if (session.message.text.toLowerCase().contains(('chào chị Thúy đi e').toLowerCase())) {
        session.send('em chào chị Thúy xinh đẹp ạ');
    } else {
        simsimi.listen(session.message.text, function (err, msg) {
            if (err) return console.error(err);
            session.send(msg);
         });
    }
});