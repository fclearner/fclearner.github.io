# public-blog Delta

## ADDED Requirements

### Requirement: Public-safe synthesis selection
The public blog SHALL only publish private-synthesis material after reducing it to general technical methods and SHALL exclude raw dialogue, private/admin content, sensitive scenarios, local paths, hostnames, ports, and source document markers.

#### Scenario: A private synthesis theme overlaps an existing public article
- **WHEN** the selected theme already has a public post
- **THEN** the existing post is supplemented instead of creating a duplicate post.

#### Scenario: A selected theme is not represented publicly
- **WHEN** the theme is public-safe and not already covered
- **THEN** a focused new public post is added.

#### Scenario: Public output is verified
- **WHEN** the public source and generated HTML are scanned
- **THEN** no forbidden private disclosure pattern is present.
