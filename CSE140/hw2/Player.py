import numpy as np

class AIPlayer:
    def __init__(self, player_number):
        self.player_number = player_number
        self.type = 'ai'
        self.player_string = 'Player {}:ai'.format(player_number)

    def get_alpha_beta_move(self, board):
        """
        Given the current state of the board, return the next move based on
        the alpha-beta pruning algorithm

        This will play against either itself or a human player

        INPUTS:
        board - a numpy array containing the state of the board using the
                following encoding:
                - the board maintains its same two dimensions
                    - row 0 is the top of the board and so is
                      the last row filled
                - spaces that are unoccupied are marked as 0
                - spaces that are occupied by player 1 have a 1 in them
                - spaces that are occupied by player 2 have a 2 in them

        RETURNS:
        The 0 based index of the column that represents the next move
        """
        
        def value(board, depth):
            count = 1
            column = -1
            returnVal = 0
            temp_board = board
            returnVal = maxValue(board)
            return returnVal
        
        def maxValue(board):
            v = -1000
            col = -1
            for i in range(6):
                for j in range(5, 0, -1):
                    if board[j][i] != 0:
                        continue
                    else:
                        temp = board
                        temp[j][i] = 1
                        val = self.evaluation_function(board)
                        if val > v:
                            col = i
                            v = val
                        break
            return col

        def expValue(board):
                val = 0
                col = -1
                inc = 0
                for i in range(6):
                    temp = board
                    for j in range(5, 0, -1):
                        if board[j][i] != 0:
                            continue
                        else:
                            inc += 1
                            temp[j][i] = 1
                            val += self.evaluation_function(board)
                            break
                if(inc == 0):
                    return 0
                val /= inc
                return val

        count = 0
        tracker = -1
        temp_boards = [0, 0, 0, 0, 0, 0, 0]
        values = [0, 0, 0, 0, 0, 0, 0]
        maxVal = -100
        for i in range(6):
            temp = board
            for j in range(5, 0, -1):
                if board[j][i] != 0:
                    continue
                else:
                    temp[j][i] = self.player_number
                    temp_boards[i] = temp
                    values[i] = int(value(temp_boards[i], 2))
        for x in range(len(values)):
            if values[x] > maxVal:
                maxVal = values[x]
                tracker = x
        return tracker

        raise NotImplementedError('Whoops I don\'t know what to do')

    def checkVertical(self, row, column, board, number):
        count = 0
        for i in range(row, 6):
            if board[i][column] == board[row][column]:
                count += 1
            else:
                break
        if count >= number:
            return 1
        else:
            return 0

    def checkHorizontal(self, row, column, board, number):
        count = 0
        for j in range(column, 7):
            if board[row][j] == board[row][column]:
                count += 1
            else:
                break
        if count >= number:
            return 1
        else:
            return 0

    def checkDiagonal(self, row, column, board, number):
        tot = 0
        count = 0
        j = column
        for i in range(row, 6):
            if j > 6:
                break
            elif board[row][j] == board[row][column]:
                count += 1
            else:
                break
            j += 1
        if count >= number:
            tot += 1
        return tot

    def check(self, board, number):
        count = 0
        for i in range(6):
            for j in range(7):
                if board[i][j] == self.player_number:
                    count += self.checkVertical(i, j, board, number)
                    count += self.checkHorizontal(i, j, board, number)
                    count += self.checkDiagonal(i, j, board, number)
        return count

    def opponentCheck(self, opponent, board, number):
        count = 0
        for i in range(6):
            for j in range(7):
                if board[i][j] == opponent:
                    count += self.checkVertical(i, j, board, number)
                    count += self.checkHorizontal(i, j, board, number)
                    count += self.checkDiagonal(i, j, board, number)
        return count

    
    def evaluation_function(self, board):
        """
        Given the current stat of the board, return the scalar value that 
        represents the evaluation function for the current player
       
        INPUTS:
        board - a numpy array containing the state of the board using the
                following encoding:
                - the board maintains its same two dimensions
                    - row 0 is the top of the board and so is
                      the last row filled
                - spaces that are unoccupied are marked as 0
                - spaces that are occupied by player 1 have a 1 in them
                - spaces that are occupied by player 2 have a 2 in them

        RETURNS:
        The utility value for the current board
        """
        if self.player_number == 1:
            opponent = 2
        else:
            opponent = 1
        Fours = self.check(board, 4)
        Threes = self.check(board, 3)
        Twos = self.check(board, 2)
        opponent_fours = self.opponentCheck(opponent, board, 4)
        opponent_threes = self.opponentCheck(opponent, board, 3)
        opponent_twos = self.opponentCheck(opponent, board, 2)
        utility = (Fours * 10 + Threes * 8 + Twos * 2) - (opponent_fours * 10 + opponent_threes * 8 - opponent_twos * 2)
        return utility

    def get_expectimax_move(self, board):
        """
        Given the current state of the board, return the next move based on
        the expectimax algorithm.

        This will play against the random player, who chooses any valid move
        with equal probability

        INPUTS:
        board - a numpy array containing the state of the board using the
                following encoding:
                - the board maintains its same two dimensions
                    - row 0 is the top of the board and so is
                      the last row filled
                - spaces that are unoccupied are marked as 0
                - spaces that are occupied by player 1 have a 1 in them
                - spaces that are occupied by player 2 have a 2 in them

        RETURNS:
        The 0 based index of the column that represents the next move
        """

        def value(board, depth):
            count = 1
            column = -1
            returnVal = 0
            temp_board = board
            returnVal = expValue(board)
            return returnVal
        
        def maxValue(board):
            v = -1000
            col = -1
            for i in range(6):
                for j in range(5, 0, -1):
                    if board[j][i] != 0:
                        continue
                    else:
                        temp = board
                        temp[j][i] = 1
                        val = self.evaluation_function(board)
                        if val > v:
                            col = i
                            v = val
                        break
            return c

        def expValue(board):
                val = 0
                col = -1
                inc = 0
                for i in range(6):
                    temp = board
                    for j in range(5, 0, -1):
                        if board[j][i] != 0:
                            continue
                        else:
                            inc += 1
                            temp[j][i] = 1
                            val += self.evaluation_function(board)
                            break
                if(inc == 0):
                    return 0
                val /= inc
                return val

        count = 0
        tracker = -1
        temp_boards = [0, 0, 0, 0, 0, 0, 0]
        values = [0, 0, 0, 0, 0, 0, 0]
        maxVal = -100
        for i in range(6):
            temp = board
            for j in range(5, 0, -1):
                if board[j][i] != 0:
                    continue
                else:
                    temp[j][i] = self.player_number
                    temp_boards[i] = temp
                    values[i] = int(value(temp_boards[i], 2))
        for x in range(len(values)):
            if values[x] > maxVal:
                maxVal = values[x]
                tracker = x
        return tracker

        raise NotImplementedError('Whoops I don\'t know what to do')

    



class RandomPlayer:
    def __init__(self, player_number):
        self.player_number = player_number
        self.type = 'random'
        self.player_string = 'Player {}:random'.format(player_number)

    def get_move(self, board):
        """
        Given the current board state select a random column from the available
        valid moves.

        INPUTS:
        board - a numpy array containing the state of the board using the
                following encoding:
                - the board maintains its same two dimensions
                    - row 0 is the top of the board and so is
                      the last row filled
                - spaces that are unoccupied are marked as 0
                - spaces that are occupied by player 1 have a 1 in them
                - spaces that are occupied by player 2 have a 2 in them

        RETURNS:
        The 0 based index of the column that represents the next move
        """
        valid_cols = []
        for col in range(board.shape[1]):
            if 0 in board[:,col]:
                valid_cols.append(col)
        return np.random.choice(valid_cols)


class HumanPlayer:
    def __init__(self, player_number):
        self.player_number = player_number
        self.type = 'human'
        self.player_string = 'Player {}:human'.format(player_number)

    def get_move(self, board):
        """
        Given the current board state returns the human input for next move

        INPUTS:
        board - a numpy array containing the state of the board using the
                following encoding:
                - the board maintains its same two dimensions
                    - row 0 is the top of the board and so is
                      the last row filled
                - spaces that are unoccupied are marked as 0
                - spaces that are occupied by player 1 have a 1 in them
                - spaces that are occupied by player 2 have a 2 in them

        RETURNS:
        The 0 based index of the column that represents the next move
        """

        valid_cols = []
        for i, col in enumerate(board.T):
            if 0 in col:
                valid_cols.append(i)

        move = int(input('Enter your move: '))

        while move not in valid_cols:
            print('Column full, choose from:{}'.format(valid_cols))
            move = int(input('Enter your move: '))

        return move

