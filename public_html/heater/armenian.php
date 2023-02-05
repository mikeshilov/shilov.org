<?php

namespace Arm {

    $knownLetters = [
        'а' => ['ա', 'Ա'],
        'о' => ['ո', 'Ո'],
        'у' => ['ու', 'ՈՒ'],
        'е' => ['է', 'Ե'],
        'э' => ['է', 'Ե'],
        'и' => ['ի', 'Ի'],
        'б' => ['բ', 'Բ'],
        'в' => ['վ', 'Վ'],
        'c' => ['ս', 'Ս'],
        'н' => ['ն', 'Ն'],
        'м' => ['մ', 'Մ'],
        'к' => ['կ', 'Կ'],
        'х' => ['հ', 'Հ', 'խ', 'Խ'],
    ];

    $stateFile = "state.json";

    function getWords()
    {
        global $knownLetters;
        $wordsFile = "words.json";
        if (!file_exists($wordsFile)) {
            $nouns = json_decode(file_get_contents('russian_nouns.json'), true);
            $words = [];
            foreach ($nouns as $word) {
                $accept = true;
                for ($i = 0; $i < strlen($word); $i++) {
                    $letter = $word[$i];
                    if (!array_key_exists($letter, $knownLetters)) {
                        $accept = false;
                        break;
                    }
                }
                if ($accept) {
                    $words[] = $word;
                }
            }
            file_put_contents($wordsFile, json_encode($words, JSON_UNESCAPED_UNICODE));
            return $words;
        } else {
            return json_decode(file_get_contents($wordsFile), true);
        }
    }

    function getState()
    {
        global $stateFile;
        if (!file_exists($stateFile)) {
            return [
                'letters' => [],
                'words' => []
            ];
        } else {
            return json_decode(file_get_contents($stateFile), true);
        }
    }

    function saveState($state)
    {
        global $stateFile;
        file_put_contents($stateFile, json_encode($state, JSON_UNESCAPED_UNICODE));
    }

    function ru2am($n, $w, $state)
    {
        global $knownLetters;
        echo $n . ". " . $w . PHP_EOL;
        fgets(STDIN);
        $answer = '';
        for ($i = 0; $i < strlen($w); $i++) {
            $ltr = $w[$i];
            $answer .= $knownLetters[$ltr][0];
            if (array_key_exists($ltr, $state["letters"])) {
                $state["letters"][$ltr] += 1;
            } else {
                $state["letters"][$ltr] = 1;
            }
        }
        $answer .= ' ';
        for ($i = 0; $i < strlen($w); $i++) {
            $ltr = $w[$i];
            $answer .= $knownLetters[$ltr][1];
        }

        echo $answer . PHP_EOL . PHP_EOL;

        $state["words"][] = $w;
        saveState($state);
    }

    function play($tasks = 3)
    {
        $state = getState();
        $words = getWords();

        for ($task_no = 0; $task_no < $tasks; $task_no++) {
            $selected_word = null;

            for ($i = 0; $i < 1000; $i++) {
                $word = $words[array_rand($words)];
                if (!in_array($word, $state['words'])) {
                    $selected_word = $word;
                    break;
                }
            }

            if ($selected_word) {
                ru2am($task_no, $selected_word, $state);
            } else {
                echo "Can't select next word\n";
            }
        }
    }
}