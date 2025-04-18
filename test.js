const Game = require('./Game');
const History = require('./History');
const piece = require('./piece');
const { getPawnAllowedMoves } = require('./piece'); 
const {getKnightAllowedMoves} = require('./piece');
const {getKingAllowedMoves} = require('./piece');
const {getBishopAllowedMoves} = require('./piece');
const {getRookAllowedMoves} = require('./piece');
const {getQueenAllowedMoves} = require('./piece');
const ai = require('./ai');



function runTests() {
    // Тест 1: Проверка инициализации игры
    try {
        const pieces = [
            { rank: 'pawn', position: 21, color: 'white', name: 'whitePawn1', ableToCastle: false },
            { rank: 'rook', position: 11, color: 'black', name: 'blackRook1', ableToCastle: true }
        ];
        const game = new Game(pieces, 'white');

        console.assert(game.pieces.length === 2, 'Тест 1.1: Неправильное количество фигур');
        console.assert(game.turn === 'white', 'Тест 1.2: Неправильный ход');

        console.log('Тест 1 "Проверка инициализации игры пройден" пройден!');
    } catch (error) {
        console.error('Ошибка в Тесте 1:', error);
    }

    // Тест 2: Добавление фигуры
try {
    const pieces = [
        { rank: 'pawn', position: 21, color: 'white', name: 'whitePawn1', ableToCastle: false }
    ];
    const game = new Game(pieces, 'white');
    const newPiece = { rank: 'queen', position: 31, color: 'black', name: 'blackQueen', ableToCastle: false };

    game._addPiece(newPiece);

    console.assert(game.pieces.length === 2, 'Тест 2.1: Неправильное количество фигур после добавления');
    console.assert(game.playerPieces.black.length === 1, 'Тест 2.2: Неправильное количество черных фигур после добавления');
    console.assert(game.pieces[1].name === 'blackQueen', 'Тест 2.3: Неправильное имя новой фигуры');

    console.log('Тест 2 "Добавление фигуры" пройден!');
} catch (error) {
    console.error('Ошибка в Тесте 2:', error);
}

// Тест 3: Удаление фигуры
try {
    const pieces = [
        { rank: 'rook', position: 11, color: 'black', name: 'blackRook1', ableToCastle: true }
    ];
    const game = new Game(pieces, 'black');
    const pieceToRemove = game.pieces[0];

    game._removePiece(pieceToRemove);

    console.assert(game.pieces.length === 0, 'Тест 3.1: Неправильное количество фигур после удаления');
    console.assert(game.playerPieces.black.length === 0, 'Тест 3.2: Неправильное количество черных фигур после удаления');

    console.log('Тест 3 "Удаление фигуры" пройден!');
} catch (error) {
    console.error('Ошибка в Тесте 3:', error);
}

// Тест 4: Сохранение истории
try {
    const pieces = [
        { rank: 'pawn', position: 21, color: 'white', name: 'whitePawn1', ableToCastle: false }
    ];
    const game = new Game(pieces, 'white');

    game.saveHistory();
    console.assert(game.history !== undefined, 'Тест 4.1: История не была сохранена корректно');

    console.log('Тест 4 "Сохранение истории" пройден!');
} catch (error) {
    console.error('Ошибка в Тесте 4:', error);
}
// Тест 5: проверка ситуации шах и мат
try {
    const pieces = [
        { rank: 'king', position: 51, color: 'white', name: 'whiteKing' },
        { rank: 'rook', position: 61, color: 'black', name: 'blackRook' }
    ];
    const game = new Game(pieces, 'white');

    let checkMateTriggered = false;
    game.on('checkMate', (color) => {
        checkMateTriggered = true;
        console.assert(color === 'white', 'Тест 5.1: Неверный цвет короля в шах и мат');
    });

    game.checkmate('white');
    console.assert(checkMateTriggered, 'Тест 5.2: Событие checkMate не было вызвано');

    console.log('Тест 5 "Проверка Шах и Мат" пройден!');
} catch (error) {
    console.error('Ошибка в Тесте 5:', error);
}
// Тест 6: проверка фильтрации фигур по цвету и количеству
try {
    const pieces = [
        { rank: 'pawn', position: 21, color: 'white', name: 'whitePawn1' },
        { rank: 'rook', position: 81, color: 'black', name: 'blackRook1' }
    ];
    const game = new Game(pieces, 'white');

    const whitePieces = game.getPiecesByColor('white');
    console.assert(whitePieces.length === 1, 'Тест 6.1: Неверное количество белых фигур');
    console.assert(whitePieces[0].name === 'whitePawn1', 'Тест 6.2: Неверная фигура возвращена');

    console.log('Тест 6 "Цвет и количество фигур" пройден!');
} catch (error) {
    console.error('Ошибка в Тесте 6:', error);
}
// Тест 7: проверка логики хождения пешек
try {
    const whitePawn = { rank: 'pawn', position: 21, color: 'white' };
    const blackPawn = { rank: 'pawn', position: 71, color: 'black' };

    const [attackMovesWhite, moveMovesWhite] = getPawnAllowedMoves(whitePawn);
    const [attackMovesBlack, moveMovesBlack] = getPawnAllowedMoves(blackPawn);

    console.assert(moveMovesWhite.includes(31), 'Тест 7.1: Белая пешка не может ходить вперёд');
    console.assert(moveMovesWhite.includes(41), 'Тест 7.2: Белая пешка на начальной позиции не может ходить на две клетки вперёд');
    console.assert(attackMovesWhite.includes(30), 'Тест 7.3: Атакующие ходы белой пешки некорректны');

    console.assert(moveMovesBlack.includes(61), 'Тест 7.4: Чёрная пешка не может ходить вперёд');
    console.assert(moveMovesBlack.includes(51), 'Тест 7.5: Чёрная пешка на начальной позиции не может ходить на две клетки вперёд');
    console.assert(attackMovesBlack.includes(62), 'Тест 7.6: Атакующие ходы чёрной пешки некорректны');

    console.log('Тест 7 "Хождение пешкой" пройден!');
} catch (error) {
    console.error('Ошибка в Тесте 7:', error);
}
// Тест 8: проверка логики хождения коня
try {
    const knight = { rank: 'knight', position: 42, color: 'white' };

    const allowedMoves = getKnightAllowedMoves(knight);
    console.assert(allowedMoves.flat().includes(63), 'Тест 8.1: Ходы коня не включают правильную позицию');
    console.assert(allowedMoves.flat().includes(30), 'Тест 8.2: Ходы коня не включают правильную позицию');
    console.log('Тест 8 "Хождение конём" пройден!');
} catch (error) {
    console.error('Ошибка в Тесте 8:', error);
}
// Тест 9: проверка логики хождения короля
try {
    const king = { rank: 'king', position: 55, color: 'white' };

    const allowedMoves = getKingAllowedMoves(king);
    console.assert(allowedMoves.flat().includes(65), 'Тест 9.1: Ходы короля не включают правильную позицию');
    console.assert(allowedMoves.flat().includes(56), 'Тест 9.2: Ходы короля не включают правильную позицию');
    console.log('Тест 9 "Хождение королём" пройден!');
} catch (error) {
    console.error('Ошибка в Тесте 9:', error);
}
// Тест 10: проверка на выход за предел доски
try {
    const pieces = [
        { rank: 'king', position: 51, color: 'white', name: 'whiteKing' },
        { rank: 'rook', position: 61, color: 'black', name: 'blackRook1' },
        { rank: 'rook', position: 41, color: 'black', name: 'blackRook2' }
    ];

    const game = new Game(pieces, 'white');

    let checkMateTriggered = false;
    game.on('checkMate', (color) => {
        checkMateTriggered = true;
        console.assert(color === 'white', 'Тест: Шах и мат неправильному цвету');
    });

    game.checkmate('white');
    console.assert(checkMateTriggered, 'Тест: Событие `checkMate` не было вызвано');

    console.log('Тест 10 "Выход за пределы доски" пройден!');
} catch (error) {
    console.error('Ошибка в тесте 10:', error);
}
// Тест 11: проверка на логики хождения слона
try {
    const bishop = { rank: 'bishop', position: 44, color: 'white' };

    const allowedMoves = getBishopAllowedMoves(bishop);
    console.assert(allowedMoves[0].includes(55), 'Тест 11.1: Слон не может ходить вправо-вверх');
    console.assert(allowedMoves[2].includes(35), 'Тест 11.2: Слон не может ходить вправо-вниз');
    console.log('Тест 11 "Хождение слоном" пройден!');
} catch (error) {
    console.error('Ошибка в Тесте 11:', error);
}
// Тест 12: проверка на логики хождения ладьи
try {
    const rook = { rank: 'rook', position: 41, color: 'black' };

    const allowedMoves = getRookAllowedMoves(rook);
    console.assert(allowedMoves[0].includes(51), 'Тест 12.1: Ладья не может ходить вверх');
    console.assert(allowedMoves[1].includes(31), 'Тест 12.2: Ладья не может ходить вниз');
    console.assert(allowedMoves[2].includes(42), 'Тест 12.3: Ладья не может ходить вправо');
    console.log('Тест 12 "Хождение ладьёй" пройден!');
} catch (error) {
    console.error('Ошибка в Тесте 12:', error);
}
// Тест 13: проверка на логики хождения ферзя
try {
    const queen = { rank: 'queen', position: 44, color: 'white' };

    const allowedMoves = getQueenAllowedMoves(queen);
    console.assert(allowedMoves[0].includes(54), 'Тест 13.1: Ферзь не может ходить вверх');
    console.assert(allowedMoves[3].includes(34), 'Тест 13.2: Ферзь не может ходить влево');
    console.assert(allowedMoves[5].includes(33), 'Тест 13.3: Ферзь не может ходить влево-вверх');
    console.assert(allowedMoves[6].includes(45), 'Тест 13.4: Ферзь не может ходить вправо-вверх');
    console.log('Тест 13 "Хождение ферзём" пройден!');
} catch (error) {
    console.error('Ошибка в Тесте 13:', error);
}
// Тест 14: проверка захвата фигуры противника
try {
    const pieces = [
        { rank: 'rook', position: 41, color: 'white', name: 'whiteRook' },
        { rank: 'knight', position: 42, color: 'black', name: 'blackKnight' }
    ];

    const game = new Game(pieces, 'white');

    let killTriggered = false;
    game.on('kill', (killedPiece) => {
        killTriggered = true;
        console.assert(killedPiece.name === 'blackKnight', 'Тест 14.1: Неверная фигура была взята');
    });

    const successfulMove = game.movePiece('whiteRook', 42);
    console.assert(successfulMove, 'Тест 14.2: Ладья не смогла выполнить ход на позицию фигуры противника');
    console.assert(killTriggered, 'Тест 14.3: Событие `kill` не было вызвано');

    console.log('Тест 14 "Захват фигуры противника" пройден!');
} catch (error) {
    console.error('Ошибка в Тесте 14:', error);
}
}

runTests();
