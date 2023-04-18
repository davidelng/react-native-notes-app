import { Configuration, OpenAIApi } from "openai";
import * as Db from "../db/Db";
import { queries } from "../db/queries";
import { AIPrompt } from "../../types";

const db = Db.getConnection();

export function updateApiKey(value: string) {
  if (value !== "") {
    db.transaction((tx) =>
      tx.executeSql(
        queries.get("upsertConf"),
        ["OPENAI_API_KEY", value],
        (tx, res) => {
          return true;
        },
        (tx, err) => {
          return false;
        }
      )
    );
  } else {
    db.transaction((tx) =>
      tx.executeSql(
        queries.get("deleteConf"),
        ["OPENAI_API_KEY"],
        (tx, res) => {
          return true;
        },
        (tx, err) => {
          return false;
        }
      )
    );
  }
}

// db.transaction((tx) =>
//   tx.executeSql(
//     queries.get("getConf"),
//     ["OPENAI_API_KEY"],
//     (tx, res) => {
//       confObj.apiKey = res.rows.item(0).value;
//     },
//     (tx, err) => {
//       return false;
//     }
//   )
// );

// const configuration = new Configuration({ apiKey: "" });
// const openai = new OpenAIApi(configuration);

// export async function generateCompletion(
//   prompt: string,
//   temperature = 0,
//   max_tokens = 1000
// ) {
//   const completion = await openai.createCompletion({
//     model: "text-davinci-003",
//     prompt: prompt,
//     temperature: temperature,
//     max_tokens: max_tokens,
//   });
//   return completion.data.choices[0].text;
// }

export async function generateCompletion(
  apiKey: string,
  prompt: string,
  temperature = 0,
  max_tokens = 1000
) {
  const configuration = new Configuration({ apiKey: apiKey });
  const openai = new OpenAIApi(configuration);
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: temperature,
    max_tokens: max_tokens,
  });
  return completion.data.choices[0].text;
}
