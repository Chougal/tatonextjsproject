export interface ContactFormData {
  name: string
  email: string
  company: string
  phone: string
  message: string
  inquiry_type: string
}

export interface DemoRequestData {
  name: string
  email: string
  company: string
  phone: string
  industry: string
  company_size: string
  current_challenges: string
  preferred_date: string
  preferred_time: string
}

export async function sendContactNotification(data: ContactFormData) {
  console.log("Contact notification (skipped):", data)
  return { success: true }
}

export async function sendDemoNotification(data: DemoRequestData) {
  console.log("Demo notification (skipped):", data)
  return { success: true }
}
