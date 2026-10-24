// Posts from the old site's blog no longer exist; send their links home.
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = ({ redirect }) => redirect('/', 301);
