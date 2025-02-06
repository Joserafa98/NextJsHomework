'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { db } from '@vercel/postgres';
import { redirect } from 'next/navigation';

// Initialize client once at the top level
const client = await db.connect();

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
 
    try {
        await client.sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
        revalidatePath('/dashboard/invoices');
        redirect('/dashboard/invoices');
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to create invoice.');
    }
}

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
   
    const amountInCents = amount * 100;
   
    try {
        await client.sql`
            UPDATE invoices
            SET customer_id = ${customerId}, 
                amount = ${amountInCents}, 
                status = ${status}
            WHERE id = ${id}
        `;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to update invoice.');
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}