const { app } = require("./config/app.config")
const { openai } = require("./config/openai.config")

app.message("", async ({ message, say }) => {
  try {
    const GREETING = `${message.user} \n ¡Hola! Soy el Bot de Mendesaltaren sobre cosas de People.
Es posible que esta sea la información que estás buscando:`
    const thread = await openai.beta.threads.create()

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message.text,
    })

    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: process.env.ASSISTANT_ID,
      instructions: `Start your message by using this as a greet: ${GREETING}`,
    })

    if (run.status === "completed") {
      const messages = await openai.beta.threads.messages.list(thread.id)
      const conversation = messages.data
      const lastMessage = conversation[0].content[0].text.value
      await say(lastMessage)
    } else {
      console.log("SORRY :<")
      await say("Sorry...")
    }
  } catch (error) {
    console.log("Error ==>", error)
  }
})
;(async () => {
  let port = process.env.PORT
  if (port == null || port == "") {
    port = 8000
  }
  await app.start(port)

  console.log("⚡️ Bolt app is running!")
})()
