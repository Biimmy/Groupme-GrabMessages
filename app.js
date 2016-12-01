const request = require('request');
var fs = require('fs');

var token = 'groupme token';
var stream = fs.createWriteStream("messages.txt");
var group_ID = 'group 1d#'

//var before_id = NULL;

var pack = {};
pack.limit = 100;
var message_id = 0;
var counter = 0;

grabMessages(0);

function writeData(parse)
{
	for (var i = 0; i < parse.response.messages.length; i++)
	{
		if (parse.response.messages[i].text != null)
		{
			var words = parse.response.messages[i].text.split(" ");
			for (var j = 0; j < words.length; j++)
			{
				if (words[j] != "")
				{
					words[j] = words[j].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
					words[j] = words[j].toLowerCase();
					console.log(words[j]);
					stream.write(parse.response.messages[i].user_id + "," + words[j] + '\n');
				}
			}
		}
	}
	if (counter < 50)
	{
		counter++;
		console.log(parse.response.messages[19].id);
		console.log(parse.response.messages.length);
		console.log(parse.response.messages[19].text);
		grabMessages(parse.response.messages[19].id);
	}
	else
	{
		stream.close();
	}
}

function grabMessages (message_id)
{
	var messageurl;
	if (message_id != 0)
		{
			pack.before_id = message_id;
			messageurl = 'https://api.groupme.com/v3/groups/'+ group_ID +'/messages?token=' + token + '&before_id=' +message_id;
		}
	else
		{
			messageurl = 'https://api.groupme.com/v3/groups/'+ group_ID + '/messages?token=' + token;
		}
	console.log(pack.before_id);
	request({
		url: messageurl,
		method: 'GET',
		body: JSON.stringify(pack)
	}, (error, response, body) => {
		var parse = JSON.parse(body);
		writeData(parse);
	});	
}