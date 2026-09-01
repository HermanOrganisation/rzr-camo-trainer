# Fix GitHub → Lovable sync

## What's actually happening

The project's own history was checked: `main` here contains no anatomy files, and its latest
commits are Lovable-authored ("Update plan", "Changes"). Claude's pushed commits are not present
in Lovable's copy of `main` at all. The connection shows as linked, so the failure is on the
inbound path — pushes to GitHub `main` are not being delivered into the project — or the two
`main` branches diverged and Lovable's version won.

## Step 1 — Protect the Claude work first (do this before anything else)

Reconnecting or re-syncing can overwrite `main`. Back it up on GitHub:

```bash
git push origin main:claude-backup
```

Confirm the `claude-backup` branch exists on GitHub and contains the anatomy files.

## Step 2 — Confirm what GitHub's main really holds

On GitHub, open the repo's commit list for `main`:

- If Claude's commits are at the top: the inbound webhook is failing (go to step 3).
- If the top commits are "Update plan" / "Changes": Lovable's pushes overwrote Claude's work,
  and the code now lives only in your local clone or in `claude-backup` (go to step 4).

## Step 3 — Repair delivery

1. Repo Settings → Webhooks → the Lovable webhook → Recent Deliveries. Red/failed deliveries
   confirm pushes never reached Lovable.
2. GitHub account/org Settings → GitHub Apps → Lovable → Configure → verify this repository is
   still in the allowed repo list. Re-grant access if it was dropped.
3. Back in Lovable: Plus (+) → GitHub → disconnect, then reconnect and select the same repo.
   On reconnect Lovable re-pulls `main`, which brings the anatomy code into the project and the
   preview.

## Step 4 — If Claude's work was overwritten

The recovery is a merge on the GitHub side, not in Lovable:

1. From your clone, restore the anatomy work onto `main` (merge `claude-backup` into `main`,
   resolving against Lovable's newer commits) and push.
2. Then reconnect in Lovable per step 3 so the project pulls the merged `main`.

## Fallback

If the sync still refuses to deliver after step 3, the fastest path to a working preview is to
rebuild the MRZR Interactive Anatomy page directly in Lovable from the spec and data you already
supplied — the previous plan for that page is still valid and can be re-issued.

## Working with both tools going forward

Lovable commits to `main` on every change, so Claude and Lovable both writing `main` will keep
colliding. Have Claude work on a feature branch and merge into `main` when Lovable is idle, or
pull Lovable's `main` into your clone before each Claude session.
