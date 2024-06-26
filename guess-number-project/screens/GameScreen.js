import { StyleSheet, Text, View, Alert, FlatList, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Title from "../components/ui/title";
import { useEffect, useState } from "react";
import NumberContainer from "../components/game/NumberContainer";
import PrimaryButton from "../components/ui/PrimaryButton";
import Card from "../components/ui/Card";
import InstructionText from "../components/ui/InstrunctionText";
import GuessLogItem from "../components/game/GuessLogItem";

function generateRandomBetween(min, max, exclude) {
    const rndNum = Math.floor(Math.random() * (max - min)) + min;

    if (rndNum === exclude) {
        return generateRandomBetween(min, max, exclude);
    } else {
        return rndNum;
    }
}

let minBoundary = 1;
let maxBoundary = 100;

function GameScreen({userNumber, onGameOver}) {

    const initialGuess = generateRandomBetween(1, 100, userNumber);
    const [currentGuess, setCurrentGuess] = useState(initialGuess);
    const [guessRounds, setGuessRounds] = useState([initialGuess]);
    const { width , height } = useWindowDimensions();

    useEffect(() => {
        if (currentGuess == userNumber) {
            onGameOver(guessRounds.length);
        }
    }, [currentGuess, userNumber, onGameOver]);

    useEffect(() => {
        minBoundary = 1;
        maxBoundary = 100;
    }, []);

    function nextGuessHandler(direction) {

        if ((direction === "lower" && currentGuess < userNumber) || (direction === "higher" && currentGuess > userNumber)) {
            Alert.alert("Don't lie!", "You know that this is wrong...", [{ text: "Sorry!", style: "cancel" }]);
            return;
        }

        if (direction === "lower") {
            maxBoundary = currentGuess;
        }else {
            minBoundary = currentGuess + 1;
        }

        const newRndNumber = generateRandomBetween(minBoundary, maxBoundary, currentGuess);
        setCurrentGuess(newRndNumber);
        setGuessRounds((prevGuess) => [...prevGuess,newRndNumber]);
    }

    const guessRoundsListLength = guessRounds.length;

    var content = <>
        <NumberContainer> {currentGuess} </NumberContainer>
        <View>
            <Card>
                <InstructionText style={styles.instructionText}>Higher or lower ?</InstructionText>
                <View style={styles.buttonGroup}>
                    <View style={styles.buttonContainer}>
                        <PrimaryButton onPress={nextGuessHandler.bind(this, "lower")}>
                            <Ionicons name="md-remove" size={24} color="white" />
                        </PrimaryButton>
                    </View>
                    <View style={styles.buttonContainer}>
                        <PrimaryButton onPress={nextGuessHandler.bind(this, "higher")} >
                            <Ionicons name="md-add" size={24} color="white" />
                        </PrimaryButton>
                    </View>
                </View>
            </Card>
        </View>
    </>

    if(width > 500)
    {
        content = <>
            <InstructionText style={styles.instructionText}>Higher or lower ?</InstructionText>
            <View style={styles.buttonContainerWide}>
                <View style={styles.buttonContainer}>
                    <PrimaryButton onPress={nextGuessHandler.bind(this, "lower")}>
                        <Ionicons name="md-remove" size={24} color="white" />
                    </PrimaryButton>
                </View>
                <NumberContainer> {currentGuess} </NumberContainer>
                <View style={styles.buttonContainer}>
                        <PrimaryButton onPress={nextGuessHandler.bind(this, "higher")} >
                            <Ionicons name="md-add" size={24} color="white" />
                        </PrimaryButton>
                </View>

            </View>
        </>
    }

    return (
        <View style={styles.screen}>
            <Title>Opponent's screen</Title>
            {content}
            <View style={styles.logList}>
               <FlatList data={guessRounds} 
                         renderItem={(guess) => <GuessLogItem roundNumber={guessRoundsListLength - guess.index} guess={guess.item}>{guess.item}</GuessLogItem>}
                         keyExtractor={(guess) => guess}/> 
            </View>
        </View>
    )
}

export default GameScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 40,
        alignItems: 'center'
    },
    buttonGroup: {
        flexDirection: "row"
    },
    buttonContainer: {
        flex: 1
    },
    instructionText: {
        marginBottom: 20
    },
    logList: {
        padding: 16,
        flex: 1
    },
    buttonContainerWide: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})