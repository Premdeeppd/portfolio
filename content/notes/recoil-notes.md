---
title: "Recoil"
slug: "recoil-notes"
description: "Personal knowledge reference note on Recoil."
featured: false
---


### Limitation of React State management —

> 
> - Component state can only be shared by pushing it up to the common ancestor and it causes unnecessary re-render.
> - React Context can hold and object full of different values - like your user profile, theme setting and shopping cart data at once but when a value inside a context changes, every single component listening to that context is forced to re-render.
>

### Benefits of using Recoil —

> 
> - A boilerplate-free API where shared state has the same simple get/set interface as react local state.
> - Code-splitting possible, which helps UI engineer to stop worrying about states.
> - Can directly use the state wherever needed without worrying about unnecessary re-renders of react tree.
>

## Two core concepts you need to know


Recoil turn your data into a flexible network instead of a rigid tree. Think of like a digital corkboard in an office.


### Atoms (The Sticky Notes)

- Atoms is a single piece of state. Think of it as a sticky note pinned to the center of the corkboard.
- Any component in your application can read it and change it. That is — atoms are subscribable and updatable.
- The moment someone update the sticky note, only the people (components) who are actively looking at the specific note will care and update themselves. The rest of the office keeps working uninterrupted.

```javascript
// This is how you create atom for font size

const fontSizeState = atom({
  key: 'fontSizeState', // A unique ID for this note
  default: 14,          // The starting value
});
```

- `useRecoilState` — To read and write an atom from a component, we use this hook. It is just like `useState`.

```javascript
function FontButton() {
  const [fontSize, setFontSize] = useRecoilState(fontSizeState);
  return (
    <button onClick={() => setFontSize((size) => size + 1)} style={{fontSize}}>
      Click to Enlarge
    </button>
  );
}
```


### Selectors (The Smart Assistants)

- Selectors are pure function that calculates “derived state.” Think of a selector as a smart assistant which do some mathematics for you taking a specific atom as an argument and return some modified result.
- **Automatic Calculation**: If the assistant is watching the `fontSizeState` sticky note (e.g., `14`), and you ask for the label, they will instantly hand you `"14px"`.
- **Smart Caching:** If the sticky note hasn't changed, the assistant doesn't redo the math; they just hand you the answer they already have memorized. Means handling the use of `useMemo`.
- **Chain Reactions:** If someone changes the sticky note to `15`, the assistant instantly notices, recalculates `"15px"`, and shouts the update to any component listening to them.

```javascript
// This assistant grabs the font size and adds "px" to it
const fontSizeLabelState = selector({
  key: 'fontSizeLabelState',
  get: ({get}) => {
    const fontSize = get(fontSizeState); // Looking at the sticky note
    return `${fontSize}px`;              // Returning the formatted result
  },
});
```

- The Data Flow.

    Atoms (Raw Data) —> Selectors (Transformed Data) —> React Components (UI)


## <RecoilRoot>

- `<RecoilRoot>` is the context provider that sets up the entire Recoil environment.
- ou wrap this around your entire application (usually in `App.js` or `index.js`). If you don't wrap your app in this, React will have no idea what an "atom" is and will throw an error.

```javascript
function App() {
  return (
    <RecoilRoot>
      <TodoList /> {/* Everything inside here can now use Recoil! */}
    </RecoilRoot>
  );
}
```


## Important Recoil Hooks 


### useRecoilState()

- This hook is the closest cousin to React’s standard `useState()`. It gives you both the current value and a function to change it.
- It hooks a component up to an atom so the component can **read** the data _and_ **write/update** the data.

```javascript
// Reading and writing to our todo list array
const [todoList, setTodoList] = useRecoilState(todoListState);
```


### useRecoilValue()

- It **only reads** the value of an atom or a selector. It doesn't give you a setter function.
- Use this when a component just displays information (like a list showing all your tasks, or a counter showing "Total Items: 5").

```javascript
// Just reading the list to map over it and show it on screen
const todoList = useRecoilValue(todoListState);
```


### useSetRecoilState()

- It **only gives you the setter function** to change the data. It does _not_ read the current value.
- Use this when a component needs to trigger a change but doesn't care what the current value is (like a "Submit" button or a text box where you type a _new_ todo item to add to the list).
- **Crucial Performance Benefit:** Because this component isn't reading the data, it **will not re-render** when the atom changes. The button stays completely still, drastically speeding up your app.

```javascript
// We only want the power to add items, we don't need to read the list here
const setTodoList = useSetRecoilState(todoListState);
```

