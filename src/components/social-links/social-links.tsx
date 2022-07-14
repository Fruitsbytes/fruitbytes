import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'social-links',
  styleUrl: 'social-links.scss',
  shadow: true,
})
export class SocialLinks {

  links = [
    {
      url: '#',
      name: 'Github',
      image: 'github',
    },
    {
      url: '#',
      name: 'LinkedIn',
      image: 'linkedin',
    },
    {
      url: '#',
      name: 'Stack Overflow',
      image: 'stackoverflow',
    },
    {
      url: '#',
      name: 'PluralSite',
      image: 'pluralSight',
    },
    {
      url: '#',
      name: 'Twitter',
      image: 'twitter',
    },
  ];

  render() {
    return (
      <Host>
        <div class='social-links text-gray-100 flex justify-between items-center'>
          {
            this.links.map(
              link => (<a href={link.url}>
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
