# PDC 2022

This repository contains information about PDC OSS project that contains the software and configurations to run the schedule application
that is now statically exported to [schedule.pdc2022.org](https://schedule.pdc2022.org).

## About

The Participatory Design Conference (PDC) ran globally, virtually and physically in Newcastle upon Tyne.
The physical conference ran between 19th of August to the 1st of September 2022.
It was a collaboration between
[Newcastle University](https://www.ncl.ac.uk/),
[Open Lab](https://openlab.ncl.ac.uk/),
[Edinburgh University](https://www.ed.ac.uk/),
[Design Informatics](https://www.designinformatics.org/),
[RMIT](https://www.rmit.edu.au/) &
[Northumbria University](https://www.northumbria.ac.uk/).

The conference was built upon the [Deconf toolkit](https://github.com/digitalinteraction/deconf) made by Open Lab
and it contributed new features back to the framework as part of its use.

**Core team**

- [Rob Anderson](https://www.r0b.io/) - Lead Engineer

## Overview

PDC OSS is mono-repo with all code in one place:

- [./client](./client) - A Vue.js based web app to experience the conference released as a docker container
- [./config](./config) - Kubernetes manifests that describe entire app deployments
- [./server](./server) - A Node.js based server that processes the schedule, manages authentication & handles metrics
- [./static](./static) - An archive of the project, hosted on GitHub pages

It uses these deconf libraries:

- [digitalinteraction/deconf-ui-toolkit](https://github.com/digitalinteraction/deconf-ui-toolkit)
- [digitalinteraction/deconf-api-toolkit](https://github.com/digitalinteraction/deconf-api-toolkit)
- [digitalinteraction/deconf-shared](https://github.com/digitalinteraction/deconf-shared)

## Features

The PDC added these features on top of deconf:

- Notion-based CMS for managing the sessions/speakers/these/tracks (all session content)
- Places grid page to showcase the global events of the conference
- Papers page to present all the papers published at the conference
- Fun bespoke style and iconography

## Contributions

PDC contributed these things back to deconf:

- The groundwork for creating static-exports for conferences
- UI for creating a private ical URL
- Added `FilteredScheduleView` to more-easily create schdele-based pages
- Support markdown in SpeakerDialogs
- Major on converting JavaScript source to ESM
- Lots of other little things, too many to list!

## More information

The PDC project lives on in Deconf, more information can be found at [digitalinteraction/deconf](https://github.com/digitalinteraction/deconf).
