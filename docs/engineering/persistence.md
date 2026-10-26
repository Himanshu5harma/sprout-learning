# Saved data and migrations

## Compatibility

The legacy `sprout-learning-v1` JSON key and original `sprout-learning-backup-before-practice-v2` are retained. Legacy migration is additive: original lesson IDs, completion IDs, draft keys, project IDs/checklist indices, bookmarks, profile, daily goal, activity, and unknown fields remain. Nested known records are validated; invalid entries are excluded from active state while the original raw save stays untouched. Unreadable JSON is retained for recovery and is not replaced with a blank save.

The new storage envelope is version 3, in IndexedDB database `sprout-progress-v3`, store `state`, key `current`. It contains validated `progress`, `conflicts`, and a deletion/reset `generation`. The compatible progress payload retains `schemaVersion: 2`; new fields (`history`, `lastLesson`, `streaksEnabled`) are additive. Export includes unresolved alternative versions as well as current drafts. Export envelope `{ format: 'sprout-progress', version: 3, exportedAt, progress, conflicts }` is separately validated.

A malformed canonical IndexedDB record is kept for recovery. Importing a validated backup first preserves that raw record under a `recovery-<uuid>` key before restoring usable state. Deleting all local learning data also removes these recovery records. A valid canonical record takes precedence over an unreadable old migration source.

The original localStorage key is a migration source/backup, not a current live mirror. Do not use old scripts that inspect it as the active save. Tests seed legacy data in isolated browser contexts and verify migration without overwriting the source.

## Writes and multiple tabs

Edits enqueue changes by field/entity, with the value observed before editing as their base. Writes are debounced 250 ms and committed through a single IndexedDB read/write transaction. Independent draft keys merge rather than replacing an entire stale snapshot. Checklist changes merge by changed index; completion/bookmark additions/removals merge against their base. History events merge by unique ID. Metadata snapshots and per-draft subscriptions are separate.

Two edits to the same draft from the same base retain both copies as a visible conflict. The canonical copy is kept, and the alternative is shown in My progress. Import also keeps differing drafts as alternatives instead of silently replacing work. Resolving a conflict is an explicit learner choice. Export before resolving if both versions are needed elsewhere.

BroadcastChannel notifies cooperating tabs to read current state. `pagehide` and visibility changes synchronously save a small per-tab localStorage recovery journal of pending entities, then request an immediate flush. Journals replay through the same transactional conflict logic on startup. A reset/deletion changes the generation so pending writes from an older tab cannot resurrect data. Full deletion removes legacy keys, recovery journals, history, and conflicts as well as active learning data.

Browser storage can fail or be evicted. Status distinguishes loading/saving/saved/error/recovery, and an export remains available. A closed/crashed process before any browser storage write cannot be guaranteed recoverable. Closing while “Saving” is visible uses the recovery journal, but storage denial/quota or OS termination can still prevent recovery. This is explicitly local-first storage, not a remote backup.

## Evidence

Practical evidence stores pass/fail, assistance, revision, a checksum of the checked code, a signature of the task contract (instructions, expected behaviour, constraints, starter, revision, and checks), timestamp, and case labels/results. Changes to code or checks make evidence stale while preserving historical completions. The checksum is a lightweight change detector, not a cryptographic signature or certificate. “Independent” means no solution was revealed for that recorded task attempt; it does not prove the learner avoided other help.

Knowledge checks, predictions, personal reflections, and self-reported project checklists remain separate records. History starts with real new events; migration never invents dates for historical completions. Published lesson durations remain estimated minutes. Data export/import/reset/delete UI includes scope descriptions and confirmation, with typed confirmation for deleting all local learning data.
