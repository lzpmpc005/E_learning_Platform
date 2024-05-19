package dev.collegex.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.cloud.gateway.filter.GatewayFilter;


@SpringBootApplication
public class GatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    } 

	@Bean
	public RouteLocator myRoutes(RouteLocatorBuilder builder) {
    return builder.routes()
		// auth server
        .route(p -> p
            .path("/auth/**")
			.filters(f -> f.rewritePath("/(?<segment>.*)", "/${segment}")
				.filter(this.removeConditionalHeaders()))
            .uri("http://authsystem:8000"))
		// content server
		.route(p -> p
            .path("/api/**")
			.filters(f -> f.rewritePath("/(?<segment>.*)", "/${segment}")
				.filter(this.removeConditionalHeaders()))
            .uri("http://contentserver:4000"))
		// bank server
		.route(p -> p
            .path("/bankx/**")
			.filters(f -> f.rewritePath("/(?<segment>.*)", "/${segment}")
				.filter(this.removeConditionalHeaders()))
            .uri("http://bankserver:8888"))
		// analysis server
		.route(p -> p
            .path("/analysis/**")
			.filters(f -> f.rewritePath("/(?<segment>.*)", "/${segment}")
				.filter(this.removeConditionalHeaders()))
            .uri("http://analysisserver:2345"))
        .build();
}

private GatewayFilter removeConditionalHeaders() {
    return (exchange, chain) -> {
        ServerHttpRequest request = exchange.getRequest().mutate()
            .header(HttpHeaders.IF_MODIFIED_SINCE, "")
            .header(HttpHeaders.IF_NONE_MATCH, "")
            .build();
        return chain.filter(exchange.mutate().request(request).build());
    };
}
}

