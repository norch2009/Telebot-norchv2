const games = new Map(); // Per-chat storage

module.exports = {
  name: 'xox',
  version: '1.0.0',
  description: 'Play X-O-X (Tic-Tac-Toe) with a friend.',
  cooldown: 5,
  permission: 'all',

  run: async (bot, msg, args) => {
    const chatId = msg.chat.id;

    // Start game
    if (args.length < 1 || !args[0].startsWith('@')) {
      return bot.sendMessage(chatId, '❌ Usage: !xox @username');
    }

    const playerX = msg.from;
    const playerO = { username: args[0].replace('@', '') };

    // Initialize game
    const game = {
      board: Array(9).fill('⬜'),
      players: {
        x: playerX,
        o: playerO
      },
      turn: 'x',
      winner: null
    };

    games.set(chatId, game);

    const boardText = renderBoard(game.board);
    return bot.sendMessage(chatId,
      `🎮 X-O-X Game Started!\n\n` +
      `❌ ${formatUser(playerX)} vs ⭕ @${playerO.username}\n\n` +
      `${boardText}\n\n` +
      `🔁 Turn: ${formatUser(playerX)} (send 1-9)`
    );
  }
};

// Handle reply numbers
module.exports.inline = async (bot, msg) => {
  const chatId = msg.chat.id;
  const game = games.get(chatId);
  const text = msg.text.trim();

  if (!game || game.winner) return;

  const index = Number(text) - 1;
  if (isNaN(index) || index < 0 || index > 8) return;

  const player = msg.from;
  const currentSymbol = game.turn;
  const currentPlayer = game.players[currentSymbol];

  // Check turn
  if (player.id !== currentPlayer.id) {
    return bot.sendMessage(chatId, `⛔ You are not in the turn.`);
  }

  if (game.board[index] !== '⬜') {
    return bot.sendMessage(chatId, `❌ That spot is already taken.`);
  }

  game.board[index] = currentSymbol === 'x' ? '❌' : '⭕';

  // Check winner
  if (checkWin(game.board, currentSymbol === 'x' ? '❌' : '⭕')) {
    game.winner = currentPlayer;
    games.delete(chatId);
    return bot.sendMessage(chatId,
      `${renderBoard(game.board)}\n\n🎉 Winner: ${formatUser(currentPlayer)}`
    );
  }

  // Check draw
  if (!game.board.includes('⬜')) {
    games.delete(chatId);
    return bot.sendMessage(chatId,
      `${renderBoard(game.board)}\n\n🤝 It's a draw!`
    );
  }

  // Next turn
  game.turn = currentSymbol === 'x' ? 'o' : 'x';
  const nextPlayer = game.players[game.turn];
  bot.sendMessage(chatId,
    `${renderBoard(game.board)}\n\n🔁 Turn: ${formatUser(nextPlayer)}`
  );
};

// Render board
function renderBoard(b) {
  return `${b[0]} | ${b[1]} | ${b[2]}\n` +
         `---------\n` +
         `${b[3]} | ${b[4]} | ${b[5]}\n` +
         `---------\n` +
         `${b[6]} | ${b[7]} | ${b[8]}`;
}

function formatUser(user) {
  return user.username ? `@${user.username}` : `${user.first_name}`;
}

// Win check
function checkWin(b, symbol) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(([a,b,c]) => [a,b,c].every(i => b[i] === symbol));
}
