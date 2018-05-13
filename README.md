https://youtu.be/lAJWHHUz8_8?t=643

showing books with title and isbn by author
http://localhost:4000/graphql?query=%7B%0A%20%20author(id%3A%204432)%20%7B%0A%20%20%20%20name%0A%20%20%20%20books%20%7B%0A%20%20%20%20%20%20title%2C%20isbn%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A

translate to russian title:
http://localhost:4000/graphql?query=%7B%0A%20%20author(id%3A%204432)%20%7B%0A%20%20%20%20name%0A%20%20%20%20books%20%7B%0A%20%20%20%20%20%20title(lang%3A%20%22ru%22)%2C%20isbn%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A