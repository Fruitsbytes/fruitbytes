import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'social-links',
  styleUrl: 'social-links.scss',
  shadow: true,
})
export class SocialLinks {

  links = [
    {
      url: 'https://github.com/Fruitsbytes',
      name: 'Github',
      image: 'github',
    },
    {
      url: 'https://www.linkedin.com/in/jeffrey-nicholson-carre/',
      name: 'LinkedIn',
      image: 'linkedin',
    },
    {
      url: 'https://stackoverflow.com/users/1427338',
      name: 'Stack Overflow',
      image: 'stackoverflow',
    },
    {
      url: 'https://app.pluralsight.com/profile/jeffrey-carr-32',
      name: 'PluralSite',
      image: 'pluralSight',
    },
    {
      url: 'https://x.com/jeffrey_n_carre',
      name: 'Twitter',
      image: 'twitter',
    },
  ];

  render() {
    return (
      <Host>
        <div class='social-links flex justify-between items-center'>
          {
            this.links.map(
              link => (<a href={link.url} target='_blank' rel='noopener noreferrer'>
                <img src={`../../assets/images/socialicon/${link.image}.svg`}
                     alt={link.name} />
              </a>)
            )
          }
        </div>
      </Host>
    );
  }

}
