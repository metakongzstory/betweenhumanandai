const apiKey = "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"
const serverless = require('serverless-http');
const { Configuration, OpenAIApi } = require("openai");
const express = require('express')
var cors = require('cors')
const app = express()
app.use(express.json());

const configuration = new Configuration({
  apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);

//CORS 이슈 해결
//let corsOptions = {
//origin: 'https://betweenhumanandai.netlify.app',
//credentials: true
//}
//app.use(cors(corsOptions));
app.use(cors());

//POST 요청 받을 수 있게 만듬
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// POST method route
app.post('/lang', async function (req, res) {
  let { Englishlevel, userMessages, assistantMessages } = req.body

  let messages = [
    { role: "system", content: "You are a nice world-no.1 expert of English words.You think that one of the best ways to learn English is to use an English-English dictionary.There are 6 English levels for you to asnwer. 1. kindergartners level 2. elementary school students level 3. middle school students level 4. high school students level 5. university school students level 6. professional workers level (such as officers, reporters, writers, lawyers). When an user chooses one level, Please do not give answers for all 6 levels and give answers only for the user's level. And please give systematic and logical answers like this. (1. part of speech (nouns, verbs, adjectives, adverbs, pronouns, prepositions, conjunctions, and interjections.) 2. how to pronounce 3. synonyms 4. example sentences)" },
    { role: "user", content: "You are a nice world-no.1 expert of English words.You think that one of the best ways to learn English is to use an English-English dictionary.There are 6 English levels for you to asnwer. 1. kindergartners level 2. elementary school students level 3. middle school students level 4. high school students level 5. university school students level 6. professional workers level (such as officers, reporters, writers, lawyers). When an user chooses one level, Please do not give answers for all 6 levels and give answers only for the user's level. And please give systematic and logical answers like this. (1. part of speech (nouns, verbs, adjectives, adverbs, pronouns, prepositions, conjunctions, and interjections.) 2. how to pronounce 3. synonyms 4. example sentences)" },
    { role: "assistant", content: "I will explain English words or sentences to you as your English level." },
    { role: "user", content: `My English level is ${Englishlevel}. Please explain English words to me as my English level.` },
    { role: "assistant", content: `Okay. I check your ${Englishlevel}  Which word do you want to know?` },
  ]

  while (userMessages.length != 0 || assistantMessages.length != 0) {
    if (userMessages.length != 0) {
      messages.push(
        JSON.parse('{"role": "user", "content": "' + String(userMessages.shift()).replace(/\n/g, "") + '"}')
      )
    }
    if (assistantMessages.length != 0) {
      messages.push(
        JSON.parse('{"role": "assistant", "content": "' + String(assistantMessages.shift()).replace(/\n/g, "") + '"}')
      )
    }
  }

  const maxRetries = 3;
  let retries = 0;
  let completion
  while (retries < maxRetries) {
    try {
      completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages
      });
      break;
    } catch (error) {
      retries++;
      console.log(error);
      console.log(`Error fetching data, retrying (${retries}/${maxRetries})...`);
    }
  }

  let lang = completion.data.choices[0].message['content']
  //console.log(BetweenHumanAndAI); 
  res.json({ "assistant": lang });
});

module.exports.handler = serverless(app);

//app.listen(3000, () => {
//console.log('Server is listening...');
//});
//마지막 백엔드 프론트엔드 연결 시에 윗 줄 지우기



