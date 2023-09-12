# Forge Confluence Global Variables

This project contains a Forge app written in Javascript that allows the creation of variables that can be used in Confluence pages, blogs, and templates in the form of a Macro.

See [developer.atlassian.com/platform/forge/](https://developer.atlassian.com/platform/forge) for documentation and tutorials explaining Forge.

## Background
This [feature suggestion](https://jira.atlassian.com/browse/CONFCLOUD-3999) served as an inspiration for the creation of this app in order to showcase
the value of Forge and how it can help customize a customer's site.

And yes, [Forge](https://developer.atlassian.com/platform/forge/) is a built-in free feature in Atlassian cloud products like Bitbucket, Confluence, and Jira.


## Requirements

See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) for instructions to get set up.

## Quick start

- Register the app by running:
```
forge register
```  

- Build and deploy your app by running:
```
forge deploy
```

- Install your app in an Atlassian site by running:
```
forge install
```

- Develop your app by running `forge tunnel` to proxy invocations locally:
```
forge tunnel
```

### Notes
- Use the `forge deploy` command when you want to persist code changes.
- Use the `forge install` command when you want to install the app on a new site.
- Once the app is installed on a site, the site picks up the new app changes you deploy without needing to rerun the install command.
- If `manifest.yml` is modified, run `forge deploy` again to reflect those changes then update the installation by running `forge install --upgrade`.

## License

Copyright (c) 2023 Atlassian and others.
Apache 2.0 licensed, see [LICENSE](LICENSE) file.