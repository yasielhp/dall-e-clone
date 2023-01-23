import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { preview } from '../assets'
import { getRandomPrompt } from '../utils'
import { FormField, Loader } from '../components'

export const CreatePost = () => {
	const navigate = useNavigate()
	const [form, setForm] = useState({
		name: '',
		prompt: '',
		photo: '',
	})
	const [generatingImg, setGeneratingImg] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const generateImage = async () => {
		if (form.prompt) {
			try {
				setGeneratingImg(true)
				const response = await fetch(
					'https://dall-e-wco9.onrender.com/api/v1/dalle',
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ prompt: form.prompt }),
					}
				)

				const data = await response.json()
				setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` })
			} catch (error) {
				setError(error.message)
			} finally {
				setGeneratingImg(false)
			}
		} else {
			setError('Please enter a prompt')
		}
	}

	const handleSubmit = async e => {
		e.preventDefault()
		if (form.name && form.prompt && form.photo) {
			setLoading(true)
			try {
				const response = await fetch(
					'https://dall-e-wco9.onrender.com/api/v1/posts',
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(form),
					}
				)

				await response.json()
				navigate('/')
			} catch (error) {
				setError(error.message)
			} finally {
				setLoading(false)
			}
		} else {
			setError('Please fill all the fields')
		}
	}

	const handleChange = e =>
		setForm({ ...form, [e.target.name]: e.target.value })

	const handleSurpriseMe = () => {
		const randomPrompt = getRandomPrompt(form.prompt)
		setForm({ ...form, prompt: randomPrompt })
	}

	return (
		<section className="max-w-7xl mx-auto">
			<div>
				<h1 className="font-extrabold text-[#222328] text-[32px]">Create</h1>
				<p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">
					Create imaginative and visually stunning images through DALL-E AI and
					share them with the community
				</p>
			</div>
			<form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
				<div className="mb-5">
					{error && (
						<p className="text-red-500 bg-red-200  rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center">
							{error}
						</p>
					)}
				</div>
				<div className="flex flex-col gap-5">
					<FormField
						labelName="Your Name"
						type="text"
						name="name"
						placeholder="Ex., john doe"
						value={form.name}
						handleChange={handleChange}
					/>

					<FormField
						labelName="Prompt"
						type="text"
						name="prompt"
						placeholder="An Impressionist oil painting of sunflowers in a purple vase…"
						value={form.prompt}
						handleChange={handleChange}
						isSurpriseMe
						handleSurpriseMe={handleSurpriseMe}
					/>

					<div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:rig-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
						{form.photo ? (
							<img
								src={form.photo}
								alt={form.prompt}
								className="w-full h-full obect-contain"
							/>
						) : (
							<img
								src={preview}
								alt="preview"
								className="w-9/12 h-9/12 object-contain opacity-40"
							/>
						)}
						{generatingImg && (
							<div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
								<Loader />
							</div>
						)}
					</div>
					<div className=",t-5 flex gap-5">
						<button
							type="button"
							onClick={generateImage}
							className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center">
							{generatingImg ? 'Generating...' : 'Generate'}
						</button>
					</div>
					<div className="mt-10">
						<p className="mt-2 text-[#666e75] text-[14px]">
							Once you have created the image you want, you can share it with
							others in the community
						</p>
						<button
							type="submit"
							className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center">
							{loading ? 'Sharing...' : 'Share with the community'}
						</button>
					</div>
				</div>
			</form>
		</section>
	)
}
