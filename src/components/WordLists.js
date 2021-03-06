import * as React     from 'react';
import { StyleSheet, Text, View, FlatList, SectionList,
}                     from 'react-native';
import { Icon,
}                     from 'react-native-elements'

const validStyle = (guess) => {
  if (!guess.valid)  return styles.entryBad
  if (guess.nogo)    return styles.nogo
  if (guess.isPan)   return styles.entryPangram
  if (guess.nyt)     return styles.entryValid
  return styles.entryOther
}

const guessItem = ({ item, delGuess }) => {
  const guess = item
  const vStyle = validStyle(guess)
  return (
    <View style={styles.guessBox}>
      <Text numberOfLines={1} style={styles.guessInfo}>
        {guess.score}
      </Text>
      <Text style={[styles.guess, vStyle]}>
        {guess.word}
      </Text>
      <Icon
        name="cancel"
        style={[styles.clearEntry]}
        onPress={() => delGuess(guess.word)}
      />
    </View>
  )
}

const GuessList = ({ guesses, delGuess }) => (
  <SectionList
    style={[styles.wordList]}
    keyExtractor={(guess) => (guess.word)}
    sections={guesses}
    renderItem={(info) => guessItem({ delGuess, ...info })}
    ListEmptyComponent={(<Text>Make a Guess</Text>)}
    renderSectionHeader={({ section }) => (<Text style={styles.guessHeader}>{section.title}</Text>)}
  />
)

const NogosList = ({ nogos, delGuess }) => (
  <FlatList
    ListHeaderComponent={<Text style={styles.guessHeader}>No-Go</Text>}
    style={[styles.wordList, styles.nogosList]}
    keyExtractor={(word, idx) => (idx.toString())}
    data={nogos}
    renderItem={(info) => guessItem({ delGuess, ...info })}
  />
)

const WordLists = ({ guesses, nogos, delGuess }) => (
  <View style={styles.wordListBox}>
    <GuessList guesses={guesses} delGuess={delGuess} />
    <NogosList nogos={nogos} delGuess={delGuess} />
  </View>
)


const styles = StyleSheet.create({
  wordListBox: {
    width:           '100%',
    flex:            6,
    flexDirection:   'row',
  },
  wordList: {
    width:           '50%',
    flex: 1,
  },
  nogosList: {
    backgroundColor: '#eee',
  },
  guessBox: {
    flexDirection:   'row',
    justifyContent:  'flex-start',
    alignItems:      'center',
    flexWrap:        'nowrap',
  },
  guess: {
    fontSize:          20,
    flex:               8,
    padding:            2,
    paddingLeft:        5,
  },
  guessInfo: {
    fontSize:          16,
    padding:            2,
    flex:               1,
    flexWrap:           'nowrap',
    textAlign:          'right',
  },
  guessHeader: {
    fontSize: 20,
    backgroundColor: '#eee',
    textAlign:       'center',
    padding:  2,
  },
  entryValid: {
    backgroundColor: '#cceecc',
  },
  entryOther: {
    backgroundColor: '#eee',
  },
  entryBad: {
    backgroundColor: '#eecccc',
  },
  entryPangram: {
    backgroundColor: '#ddddff',
  },
})

export default WordLists
