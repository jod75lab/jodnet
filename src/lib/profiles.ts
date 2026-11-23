import { z } from 'astro/zod';
import source from '../data/profiles.json';

const label = z.string().trim().min(1);
const linkSchema = z.object({
  title: label,
  url: z.url({
    protocol: /^https?$/,
    error: 'Links must use http:// or https://. Use mode: "copy" for local paths.',
  }),
});

const laneSchema = z.discriminatedUnion('mode', [
  z.object({ title: label, mode: z.literal('links').default('links'), links: z.array(linkSchema) }),
  z.object({
    title: label,
    mode: z.literal('copy'),
    links: z.array(z.object({ title: label, url: label })),
  }),
]);

const configSchema = z.object({
  defaultProfile: label,
  profiles: z.array(z.object({
    id: z.string().regex(/^[a-z][a-z0-9-]*$/, 'Use a lowercase ID, e.g. home or work.'),
    name: label,
    description: label,
    lanes: z.array(laneSchema),
  })).min(1),
}).superRefine((config, context) => {
  const ids = config.profiles.map((profile) => profile.id);
  if (new Set(ids).size !== ids.length) {
    context.addIssue({ code: 'custom', path: ['profiles'], message: 'Profile IDs must be unique.' });
  }
  if (!ids.includes(config.defaultProfile)) {
    context.addIssue({ code: 'custom', path: ['defaultProfile'], message: 'Choose an existing profile ID.' });
  }
});

const parsed = configSchema.safeParse(source);
if (!parsed.success) {
  throw new Error(`Invalid src/data/profiles.json:\n${z.prettifyError(parsed.error)}`);
}

export const { profiles, defaultProfile } = parsed.data;
export const profileCookieName = 'jodnet-profile';
