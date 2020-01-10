🎈 obdo
======

> Simple `Object` generator.

Tired of the *`json`*? Rethink it with *`obdo`*, (simple **ob**ject **do**t notation).

The **obdo** package will allow you to avoid ♾️ infinitely long levels of nesting and indentation, as well as make the markup of objects more intuitive and cleaner.


Instead of:

```js
const foo = {
  bar: 'baz',
  qux: {
    quux: 0,
    quuz: {
      corge: 1
    }
  }
}
```

You can:

```js
import o from 'obdo'

const foo = o()
  .k('bar').v('baz')
  .k('qux')
  ._().k('quux').v(0)
  ._().k('quuz')
  ._(2).k('corge').v(1)
  .o()
```

Simple, isn't it? 🌞


# Install

`npm i obdo`

Works in node and modern browsers.


In browser you can import it like [es module](https://jakearchibald.com/2017/es-modules-in-browsers/):

Just  copy `index.js` from this repo, rename it to `obdo.js` and use:

```html
<!--index.html-->
<script type="module">
  import o from './obdo.js'
  console.log(o().k('hello').v('world').o())
</script>
```


# Usage

- Basic usage:

```js
const foo = o()
  .key('bar').val('baz')
  .key('qux')
  .tab().key('quux').val('quuz')
  .o() // return
```

- Short aliases:

```js
const foo = o()
  .k('bar').v('baz')
  .k('qux')
  ._().k('quux').v('quuz')
  .o() // return
```

- ### Aliases table:

|Long|Short|Description|
|:--:|:---:|:---------:|
|`.key()`|`.k()`|Create new key|
|`.val()`|`.v()`|Assign value to key|
|`.tab()`|`._()`|Put next key inside one of the previous|
|`.obj()`|`.o()`|Return resulted object|


- ### Nesting

*To created nested object, increase `.tab()` argument. By default it equals to `1`:*

```js
const nested = o()
  .k('wrapper')
  ._().k('inside')
  ._(2).k('inside').v('of inside')
  .o() // return

/*
{
  wrapper: {
    inside: {
      inside: 'of inside'
    }
  }
}
*/
```

*You can create infinite nesting without cluttering the code with a bunch of indents:*

```js
const giza = o(true, '  ')
  .k('🧱0')
  ._(1).k('🧱1')
  ._(2).k('🧱2')
  ._(3).k('🧱3')
  ._(4).k('🧱4')
  ._(5).k('🧱5')
  ._(6).k('🧱6').v('👁️')
  .o() // return

/*
{ 
  "🧱0": {
    "🧱1": {
      "🧱2": {
        "🧱3": {
          "🧱4": {
            "🧱5": {
              "🧱6": "👁️"
            }
          }
        }
      }
    }
  }
}
*/
```


- ### Methods arguments

## `.key()` or `.k()`

|Argument|Type|Default|Description|
|:------:|:--:|:-----:|:---------:|
|`name`|`*`|`undefined`|Name of the key to install|
|`depth`|`Number`|`0`|Nesting level, don't use it directly|

## `.val()` or `.v()`

|Argument|Type|Default|Description|
|:-------:|:--:|:-----:|:---------:|
|`value`|`*`|Uses the empty parameter passed during initialization in `o()`|Value to assign|

## `.tab()` or `._()`

|Argument|Type|Default|Description|
|:-------:|:--:|:-----:|:---------:|
|`quantity`|`Number`|`1`|Tabs quantity, depth nesting level to pass to `.key()`'s `depth` parameter|


## Advanced usage

- ### Initialization arguments

|Argument|Type|Default|Description|
|:------:|:--:|:-----:|:---------:|
|`stringify`|`Boolean`|`false`|Use JSON.stringify() on result object, or not|
|`space`|`String|Number`|`undefined`|Separator for stringify, if `String` use this string as separator, else if `Number` use `number * ' '` as separator|
|`empty`|`*`|`undefined`|Replace `undefined` values with this argument|

Main `o()` function accept some arguments to tweak your object, for example:


- Stringify:

```js
const body = o(true)
  .k('id').v(777)
  .k('token').v('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
  .o() // return

// {"id":777,"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"}
```


- Stringify with two spaces:

```js
const body = o(true, '  ')
  .k('id').v(777)
  .k('token').v('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
  .o() // return

console.log(body)
/*
{
  "id": 777,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
}
*/
```


- Placeholder

If you want to pass `undefined` value to the key you can:

```js
const foo = o().k('falsy')
// { falsy: undefined }
```

or

```js
const foo = o().k('falsy').v(undefined)
// { falsy: undefined }
```
to replace `undefined` values with default pass third parameter `empty`:

```js
const foo = o(false, '', null).k('falsy')
// { falsy: null }
```

also you can pass undefined as key:

```js
const foo = o().v("i'm undefined :)").o()
// { undefined: "i'm undefined :)" }
```

to create empty object, just do:

```js
const empty = o().o()
```

⚠️ **_Remember that you should always call the `.o()` method at the end of any chain to return the desired object._**


### `.val()` argument

The argument can be any expression, any type, you can even write something like this:

```js
const weirdo = o()
  .k('self').v(o().k('foo').v('bar').o())
  .o()

// { self: { foo: 'bar' } }
```

but it's better to use standard syntax:

```js
const weirdo = o()
  .k('self')
  ._().k('foo').v('bar')
  .o()

// { self: { foo: 'bar' } }
```


# Contribute

If you want to help, or found a bug - open issue, merge/pull request, or [donate 🤑](https://en.liberapay.com/ceigh/donate).


# License

Licensed under the MIT license.
