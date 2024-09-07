package main

import (
	"bufio"
	"encoding/binary"
	"fmt"
	"math"
	"os"
	"regexp"
	"strconv"
	"strings"
	"unsafe"
)

const FILENAME = "data"

type AppData struct {
	count uint64
	cost  float64
	ml    uint64
}

func openOrCreateFile() *os.File {
	file, err := os.OpenFile(FILENAME, os.O_RDWR, 0644)
	if err != nil {
		file, err = os.Create(FILENAME)
		if err != nil {
			fmt.Printf("Error creating file: %s\n", err)
			os.Exit(1)
		}
		writeDefaultData(file)
		file.Seek(0, 0)
		err = file.Sync()
		if err != nil {
			fmt.Printf("Error syncing file: %s\n", err)
			os.Exit(1)
		}
	}
	return file
}

func writeDefaultData(file *os.File) {
	data := AppData{
		count: 0,
		cost:  20.00,
		ml:    1000,
	}
	writeData(file, data)
}

func readData(file *os.File) AppData {
	var temp AppData
	buffer := make([]byte, unsafe.Sizeof(temp))
	file.Seek(0, 0)
	_, err := file.Read(buffer)
	if err != nil {
		fmt.Printf("Error reading file: %s\n", err)
		os.Exit(1)
	}
	count := binary.LittleEndian.Uint64(buffer[0:8])
	cost := math.Float64frombits(binary.LittleEndian.Uint64(buffer[8:16]))
	ml := binary.LittleEndian.Uint64(buffer[16:24])
	data := AppData{
		count,
		cost,
		ml,
	}
	return data
}

func writeData(file *os.File, data AppData) {
	file.Seek(0, 0)
	var buffer []byte
	buffer = binary.LittleEndian.AppendUint64(buffer, data.count)
	buffer = binary.LittleEndian.AppendUint64(buffer, math.Float64bits(data.cost))
	buffer = binary.LittleEndian.AppendUint64(buffer, data.ml)
	file.Seek(0, 0)
	_, err := file.Write(buffer)
	if err != nil {
		fmt.Printf("Error writing to file: %s\n", err)
		os.Exit(1)
	}
}

func incrementCount(file *os.File) uint64 {
	data := readData(file)
	data.count++
	writeData(file, data)
	return data.count
}

func decrementCount(file *os.File) uint64 {
	data := readData(file)
	data.count--
	writeData(file, data)
	return data.count
}

func readCount(file *os.File) uint64 {
	data := readData(file)
	return data.count
}

func promptCost() float64 {
	re, err := regexp.Compile(`^\d*\.?\d*$`)
	if err != nil {
		fmt.Printf("Error compiling regexp: %s", err)
		os.Exit(1)
	}
	buf := bufio.NewReader(os.Stdin)
	result := 0.0
	for result == 0.0 {
		fmt.Printf("cost: ")
		input, err := buf.ReadString('\n')
		if err != nil {
			fmt.Printf("Error reading from stdin: %s\n", err)
			os.Exit(1)
		}
		input = strings.TrimSpace(input)
		if len(input) == 0 {
			fmt.Println("Please enter a valid decimal value.")
			continue
		}
		matched := re.Match([]byte(input))
		if err != nil {
			fmt.Printf("Error executing regex match: %s\n", err)
			os.Exit(1)
		}
		if !matched {
			fmt.Println("Please enter a valid decimal value.")
			continue
		}
		result, err = strconv.ParseFloat(input, 64)
		if err != nil {
			fmt.Printf("Error parsing float: %s\n", err)
			os.Exit(1)
		}
		if result == 0 {
			fmt.Println("Please enter a valid decimal value.")
			continue
		}
	}
	return result
}

func promptMl() uint64 {
	re, err := regexp.Compile(`^\d+`)
	if err != nil {
		fmt.Printf("Error compiling regexp: %s", err)
		os.Exit(1)
	}

	buf := bufio.NewReader(os.Stdin)
	var result uint64 = 0
	for result == 0 {
		fmt.Printf("mL: ")
		input, err := buf.ReadString('\n')
		if err != nil {
			fmt.Printf("Error reading from stdin: %s\n", err)
			os.Exit(1)
		}
		input = strings.TrimSpace(input)
		matched := re.Match([]byte(input))
		if err != nil {
			fmt.Printf("Error executing regexp: %s\n", err)
			os.Exit(1)
		}
		if !matched {
			fmt.Println("Please enter a valid positive integer value.")
			continue
		}
		result, err = strconv.ParseUint(input, 10, 64)
		if err != nil {
			fmt.Printf("Error parsing int: %s", err)
			os.Exit(1)
		}
		if result == 0 {
			fmt.Printf("Please enter a valid positive integer value.")
			continue
		}
	}
	return result
}

func cmdCount() {
	file := openOrCreateFile()
	defer file.Close()
	fmt.Printf("So far, you've made %d bottles.\n", readCount(file))
}

func cmdAdd() {
	file := openOrCreateFile()
	defer file.Close()
	fmt.Printf("Bottle added. You've now made %d total.\n", incrementCount(file))
}

func cmdRemove() {
	file := openOrCreateFile()
	defer file.Close()
	fmt.Printf("Bottle removed. You've now made %d total.\n", decrementCount(file))
}

func cmdInfo() {
	file := openOrCreateFile()
	defer file.Close()
	data := readData(file)
	fmt.Printf("Bottles: %d\nCost per cylinder: $%.2f\nmL per bottle: %d\n-----\nCurrent cost per L:\n$%.2f\n", data.count, data.cost, data.ml, data.cost/float64(data.count)*float64(data.ml)/1000)
}

func cmdConfig() {
	file := openOrCreateFile()
	defer file.Close()
	cost := promptCost()
	ml := promptMl()
	data := readData(file)
	data.cost = cost
	data.ml = ml
	writeData(file, data)
	fmt.Println("Successfully wrote config.")
}

var COMMANDS = map[string]func(){
	"count":  cmdCount,
	"add":    cmdAdd,
	"remove": cmdRemove,
	"info":   cmdInfo,
	"config": cmdConfig,
}

func getValidCommands() string {
	commandsArray := make([]string, len(COMMANDS))
	for key := range COMMANDS {
		commandsArray = append(commandsArray, key)
	}
	commands := strings.Join(commandsArray, ", ")
	return commands
}

func getCommand() (string, error) {
	if len(os.Args) < 2 {
		fmt.Printf("Please enter a command. Valid commands: %s\n", getValidCommands())
		return "", fmt.Errorf("missing command")
	}
	command := strings.ToLower(os.Args[1])
	_, ok := COMMANDS[command]
	if !ok {
		fmt.Printf("Unknown command %s. Valid commands: %s\n", command, getValidCommands())
		return "", fmt.Errorf("invalid command")
	}
	return command, nil
}

func main() {
	command, err := getCommand()
	if err != nil {
		os.Exit(1)
	}
	COMMANDS[command]()
}
