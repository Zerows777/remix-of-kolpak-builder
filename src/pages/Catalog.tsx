import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { supabase } from '../supabaseClient'

type Product = {
  id: number
  name: string
  description: string
  price: number
  category: string
  image_url: string
  in_stock: boolean
}

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('products')
      .select('id, name, description, price, category, image_url, in_stock')
      .order('id', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setError(error.message)
        } else {
          setProducts(data ?? [])
        }
        setLoading(false)
      })
  }, [])

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="site-logo">Магазин<span>.</span></Link>
          <nav className="site-nav">
            <NavLink to="/" end>Главная</NavLink>
            <NavLink to="/catalog" className="active">Каталог</NavLink>
          </nav>
        </div>
      </header>

      <div className="catalog">
        <div className="catalog__header">
          <h1>Каталог продукции</h1>
          <p>Полный ассортимент доступных товаров</p>
        </div>

        {loading && (
          <div className="state">
            <div className="state__spinner" />
            <p className="state__msg">Загрузка товаров…</p>
          </div>
        )}

        {error && (
          <div className="state state--error">
            <h2 className="state__title">Не удалось загрузить товары</h2>
            <p className="state__msg">{error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="state">
            <h2 className="state__title">Товаров пока нет</h2>
            <p className="state__msg">Загляните позже — ассортимент скоро пополнится.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="catalog__grid">
            {products.map((p) => (
              <article key={p.id} className="product-card">
                <img
                  src={p.image_url}
                  alt={p.name}
                  className="product-card__image"
                  loading="lazy"
                />
                <div className="product-card__body">
                  <span className="product-card__category">{p.category}</span>
                  <h3 className="product-card__name">{p.name}</h3>
                  <p className="product-card__desc">{p.description}</p>
                  <div className="product-card__footer">
                    <span className="product-card__price">
                      {p.price.toLocaleString('ru-RU')} <span>₽</span>
                    </span>
                    <span
                      className={
                        'product-card__stock ' +
                        (p.in_stock
                          ? 'product-card__stock--in'
                          : 'product-card__stock--out')
                      }
                    >
                      {p.in_stock ? 'В наличии' : 'Нет в наличии'}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
