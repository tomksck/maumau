<script>
  export default {
    data() {
      return {
        message: 'Welcome to MauMau'
      };
    }
  };
</script>

<template>
  <h1>{{message}}</h1>
  <p>The Game you are about to play is MauMau. An easy to learn card game where each player gets a 
    hand full of cards with the goal to get rid of said cards.
    To achieve this goal the players must throw cards according to some easy rules, depending on the table card.
  </p>
  <h2>Rules</h2>
  <p>
    A card can only be played if it corresponds to the suit or value of the face-up card. E.g. if it is the 10 of spades, only another spade or another 10 can be played (but see below for Jacks). If a player is not able to do this, they draw one card from the stack; If they can play this card, they may do so; otherwise, they keep the drawn card and passes on their turn. When the drawing stack is empty, the playing stack (except for the topmost card) is shuffled and turned over to serve as a new drawing stack.
    The 7, 8, Jack, and Ace of all suits are significant cards:
    <ul>
      <li>The 7 forces the next player to draw two cards from the stack.</li>
      <li>The 8 can be played on any card.</li>
      <li>The Jack can be played on any card.</li>
      <li>The Ace can be played on any card, but the next player must then draw four cards from the stack.</li>
    </ul>
  </p>
  <form action={{url}} method="get">
    <input type="submit" value="Start Quick Game">
  </form>
</template>