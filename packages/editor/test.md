# executable code blocks

```python name="rgb2hex", args=(red, green, blue)
return '%02x%02x%02x' % (red, green, blue)
```

```js name="get-color" args=(color)
let colors = {
	background: <<rgb2hex(250, 100, 150)>>,
	foreground: <<rgb2hex(0, 0, 50)>>
}

return colors[color]
```

```html filename="index.html"
<!doctype html><
<style>
  body {
	  background: <<get-color("background")>>,
	  color: <<get-color("foreground")>>
  }
</style>
<p>hello world</p>
```
