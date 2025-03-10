
import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sophie L.',
    content: 'Je cherchais une perruque de qualité après ma chimiothérapie. Le service client m\'a guidée et j\'ai trouvé exactement ce dont j\'avais besoin. La qualité est exceptionnelle.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976'
  },
  {
    id: 2,
    name: 'Marie T.',
    content: 'Ma perruque lace front est si naturelle que personne ne devine que je porte une perruque ! Le confort est incroyable, même pendant toute une journée.',
    rating: 4,
    image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=1974'
  },
  {
    id: 3,
    name: 'Claire B.',
    content: 'Excellente qualité pour le prix. Les cheveux sont doux et la coupe est parfaite. Livraison rapide et emballage soigné. Je recommande vivement !',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961'
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-plum-50">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Ce Que Nos Clientes Disent</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        fill={i < testimonial.rating ? "currentColor" : "none"} 
                        className={i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
