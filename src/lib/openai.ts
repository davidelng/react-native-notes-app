import { Configuration, OpenAIApi } from "openai";
import * as Db from "../db/Db";
import { queries } from "../db/queries";
import { AIPrompt } from "../../types";

function getApiKey() {
  let key = Db.getConnection().transaction((tx) =>
    tx.executeSql(
      queries.get("getConf"),
      ["OPENAI_API_KEY"],
      (tx, res) => {
        return res.rows.item(0);
      },
      (tx, err) => {
        return false;
      }
    )
  );
  return key;
}

// alert(JSON.stringify(getApiKey()));

const configuration = new Configuration({
  apiKey: "",
});
const openai = new OpenAIApi(configuration);

export async function generateCompletion(
  prompt: string,
  temperature = 0,
  max_tokens = 1000
) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: temperature,
    max_tokens: max_tokens,
  });
  return completion.data.choices[0].text;
}
