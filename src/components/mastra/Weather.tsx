'use client'

import { getWeatherInfo } from '@/app/actions';

export function Weather() {
  async function handleSubmit(formData: FormData) {
    const city = formData.get('city') as string
    const result = await getWeatherInfo(city)
    // Handle the result
    console.log(result)
  }

  return (
    <form action={handleSubmit}>
      <input name="city" placeholder="Enter city name" />
      <button type="submit">Get Weather</button>
    </form>
  )
}
