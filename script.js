let canvas
let ctx
let flowfield
let flowfieldAnimation

window.onload = () => {
	canvas = document.getElementById('canvas1')
	ctx = canvas.getContext('2d')
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
	flowfield = new FlowFieldEffect(ctx, canvas.width, canvas.height)
	flowfield.animate(0)
}

window.addEventListener('resize', () => {
	cancelAnimationFrame(flowfieldAnimation)
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
	flowfield = new FlowFieldEffect(ctx, canvas.width, canvas.height)
	flowfield.animate(0)
})

const mouse = {
	x: 0,
	y: 0,
}
window.addEventListener('mousemove', e => {
	mouse.x = e.x
	mouse.y = e.y
})

// Classes encapsulate data and then work on it with their methods

class FlowFieldEffect {
	#ctx // converting a global variable into a private class field. # prefix makes it private
	#width
	#height

	constructor(ctx, width, height) {
		this.#ctx = ctx
		this.#ctx.strokeStyle = 'white'
		this.#ctx.lineWidth = 1
		this.#width = width
		this.#height = height
		this.lastTime = 0
		this.interval = 1000 / 60
		this.timer = 0
		this.cellSize = 10
		this.gradient
		this.#createGradient()
		this.#ctx.strokeStyle = this.gradient
		this.radius = 5
		this.radiusVelocity = 0.03
	}

	#createGradient() {
		this.gradient = this.#ctx.createLinearGradient(0, 0, this.#width, this.#height)
		this.gradient.addColorStop('0.1', '#ff5c33')
		this.gradient.addColorStop('0.9', '#fff033')
	}

	#drawLine(angle, x, y) {
		let positionX = x
		let positionY = y
		let dx = mouse.x - positionX
		let dy = mouse.y - positionY
		let distance = dx ** 2 + dy ** 2
		if (distance > 300000) {
			distance = 300000
		}
		let length = distance / 5000
		this.#ctx.beginPath()
		this.#ctx.moveTo(x, y)
		this.#ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length)
		this.#ctx.stroke()
	}

	animate(timeStamp) {
		const deltaTime = timeStamp - this.lastTime
		this.lastTime = timeStamp
		if (this.timer > this.interval) {
			this.#ctx.clearRect(0, 0, this.#width, this.#height)
			this.radius += this.radiusVelocity
			if (this.radius > 5 || this.radius < -5) {
				this.radiusVelocity *= -1
			}

			for (let y = 0; y < this.#height; y += this.cellSize) {
				for (let x = 0; x < this.#width; x += this.cellSize) {
					const angle = (Math.cos(x * 0.01) + Math.sin(y * 0.01)) * this.radius
					this.#drawLine(angle, x, y)
				}
			}

			this.timer = 0
		} else {
			this.timer += deltaTime
		}

		flowfieldAnimation = requestAnimationFrame(this.animate.bind(this))
	}
}
