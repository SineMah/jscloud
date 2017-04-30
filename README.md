
# What am i

I'm just a little js lib to place some words with a custom class in a div.
You have the full control over the style.


# Use me

```js
var words = ['blue', 'birds', 'be', 'aware'],
	newWords = [];

words.forEach(function(word, index){
    var obj = {
        text: word,
        occur: index + 1,
        class: 'sidekick'
    };

    newWords.push(obj);
});

$('#cloud').JSCloud(newWords);
```

Easy as pie, isn't it?