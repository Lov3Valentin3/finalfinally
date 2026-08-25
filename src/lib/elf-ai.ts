type ElfPersona = {
  name: string;
  personality: string;
  hobbies: string;
  christmasJob: string;
  favoriteTreats: string;
  funFacts: string;
  greetingStyle: string;
};
type ChildContext = {
  firstName: string;
  age: number;
  favoriteColor: string;
  favoriteActivity: string;
  birthday?: string | null;
  christmasWishes?: string | null;
  insideJokes?: string | null;
};
type HistoryItem = {
  sender: string;
  body: string;
};
function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}
function ageTone(age: number) {
  if (age <= 5) {
    return "Use very simple words, short sentences, and lots of wonder.";
  }
  if (age <= 8) {
    return "Keep language playful and easy, with fun details and gentle jokes.";
  }
  return "Be warm and clever, still kid-safe, with imaginative storytelling.";
}
function detectTopic(message: string) {
  const m = message.toLowerCase();
  if (/(birthday|bday)/.test(m)) return "birthday";
  if (/(santa|mrs\.?\s*claus)/.test(m)) return "santa";
  if (/(reindeer|rudolph)/.test(m)) return "reindeer";
  if (/(cookie|bake|treat|candy)/.test(m)) return "treats";
  if (/(toy|present|gift|wish)/.test(m)) return "gifts";
  if (/(sad|scared|lonely|mad|angry)/.test(m)) return "feelings";
  if (/(school|homework|friend)/.test(m)) return "school";
  if (/(joke|funny|laugh)/.test(m)) return "joke";
  if (/(christmas|xmas|holiday)/.test(m)) return "christmas";
  return "general";
}
export function generateElfReply(params: {
  elf: ElfPersona;
  child: ChildContext;
  history: HistoryItem[];
  latestMessage: string;
}) {
  const { elf, child, history, latestMessage } = params;
  const topic = detectTopic(latestMessage);
  const priorChildNotes = history
    .filter((h) => h.sender === "child")
    .slice(-4)
    .map((h) => h.body)
    .join(" ");
  const rememberedWish =
    child.christmasWishes ||
    (priorChildNotes.match(/i want ([^.!?]+)/i)?.[1] ?? null);
  const openers = [
    `${elf.greetingStyle}`,
    `Hi ${child.firstName}!`,
    `${child.firstName}, you made my elf ears wiggle with joy!`,
    `Snowy hello, ${child.firstName}!`,
  ];
  const personalityBits = [
    `As a ${elf.personality.toLowerCase()} elf, I loved your message.`,
    `Between you and me, while I was busy with my job (${elf.christmasJob.toLowerCase()}), I kept smiling about you.`,
    `Want a secret? ${elf.funFacts}`,
  ];
  const hobbyBits = [
    `Lately I've been ${elf.hobbies.split(",")[0].trim().toLowerCase()} and thinking of your favorite thing: ${child.favoriteActivity}.`,
    `Your favorite color ${child.favoriteColor} would look amazing on a new workshop banner!`,
    `If you visited, we'd share ${elf.favoriteTreats.toLowerCase()} and talk about ${child.favoriteActivity}.`,
  ];
  let topicLine = "";
  switch (topic) {
    case "birthday":
      topicLine = `Guess what? The whole workshop is humming "Happy Birthday" energy for you${child.birthday ? ` around ${child.birthday}` : ""}. I'll hang extra lights just for ${child.firstName}!`;
      break;
    case "santa":
      topicLine =
        "Santa peeked over my shoulder and said you're on the wonderful list for being such a kind friend.";
      break;
    case "reindeer":
      topicLine =
        "The reindeer say hi! Dash tried to teach me a fancy landing and we both ended up in a soft snowbank. Giggles everywhere.";
      break;
    case "treats":
      topicLine = `That reminds me of snack time. Today we had ${elf.favoriteTreats.toLowerCase()}. I saved a sprinkle of magic sugar for you.`;
      break;
    case "gifts":
      topicLine = rememberedWish
        ? `I wrote your wish about ${rememberedWish} in my sparkle notebook so I won't forget.`
        : "Tell me more about your Christmas wishes — I keep a glittery list just for my pen pals.";
      break;
    case "feelings":
      topicLine = `It's okay to feel that way, ${child.firstName}. Even elves have cloudy moments. Want to take three cozy breaths with me? In... out... you're brave and loved.`;
      break;
    case "school":
      topicLine =
        "School adventures are like quests! If something felt hard, you still showed up — that is real North Pole courage.";
      break;
    case "joke":
      topicLine = pick([
        'Why did the scarecrow win an award? Because he was outstanding in his field... of candy canes!',
        "What do you call a snowman with a six-pack? An abdominal snowman!",
        "How do elves answer the phone? 'Light up!' Wait — I mean 'Hello!' Hehe.",
      ]);
      break;
    case "christmas":
      topicLine =
        "Christmas magic is already buzzing here. The trees are practicing their twinkles and the presents are learning how to sit still.";
      break;
    default:
      topicLine = pick([
        `I read every word you wrote and tucked it into my heart pocket.`,
        `Your message made the workshop lights flicker in happy patterns.`,
        `I can picture us chatting by the fireplace about "${latestMessage.slice(0, 60)}${latestMessage.length > 60 ? "..." : ""}".`,
      ]);
  }
  const memoryLine =
    history.length > 2
      ? `I still remember our earlier chats — our friendship is growing like a Christmas tree!`
      : `This is the start of a magical friendship, and I already feel lucky.`;
  const jokeBit = child.insideJokes
    ? ` P.S. Our inside joke still cracks me up: ${child.insideJokes}`
    : "";
  const closers = [
    `Write me again soon, okay? Your friend, ${elf.name} ✨`,
    `Sending snowflake hugs, ${elf.name}`,
    `From my bunk in Santa's workshop to you — ${elf.name}`,
    `Catch you in the next letter, pen pal! — ${elf.name}`,
  ];
  // Keep response age-appropriate length
  const body =
    child.age <= 5
      ? `${pick(openers)} ${topicLine} You are awesome! ${pick(closers)}`
      : `${pick(openers)} ${pick(personalityBits)} ${topicLine} ${pick(hobbyBits)} ${memoryLine}${jokeBit} ${pick(closers)}`;
  // Soft safety: never include adult content; responses are constructed from templates.
  return body.replace(/\s+/g, " ").trim();
}
export function buildWelcomeMessage(elf: ElfPersona, child: ChildContext) {
  return `${elf.greetingStyle} I'm ${elf.name}, your brand-new elf pen pal from the North Pole! I heard you love ${child.favoriteActivity} and the color ${child.favoriteColor} — excellent choices. I work as someone who ${elf.christmasJob.toLowerCase()}, and I can't wait to swap stories, jokes, and Christmas wishes with you, ${child.firstName}. Write me anytime!`;
}
